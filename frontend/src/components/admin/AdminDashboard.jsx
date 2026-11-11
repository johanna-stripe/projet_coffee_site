import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import api from "../../axios/axiosConfig.js";
import {CLIENT_PATHS} from "../../routes/paths.js";
import "../../style/userPurchases.css";   // badges de statut (purchase-status-*)
import "../../style/adminDashboard.css";

const LOW_STOCK = 5;          // même seuil que la page Produits
const LIST_SIZE = 5;          // lignes affichées dans chaque encart
const NEW_USERS_DAYS = 30;    // « nouveaux inscrits » = sur les 30 derniers jours

const STATUS = {
    paid: {label: 'Payé', className: 'purchase-status-paid'},
    pending: {label: 'En attente', className: 'purchase-status-pending'},
    shipped: {label: 'Expédié', className: 'purchase-status-shipped'},
    delivered: {label: 'Livré', className: 'purchase-status-delivered'},
    cancelled: {label: 'Annulé', className: 'purchase-status-cancelled'},
};

const formatPrice = (value) => `${Number(value || 0).toFixed(2).replace('.', ',')} €`;
const formatDate = (value) => new Date(value).toLocaleDateString('fr-FR');
const fullName = (person) => [person.first_name, person.last_name].filter(Boolean).join(' ');

// Une liste vide (404) n'est pas une erreur : le tableau de bord affiche simplement 0
const fetchList = async (url, pick) => {
    try {
        const response = await api.get(url);
        return pick(response.data) || [];
    } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
    }
};

// Encart « liste de commandes » : utilisé pour « à traiter » et « à expédier »
const OrdersPanel = ({title, orders, emptyText, status}) => (
    <section className="admin-dashboard-panel">
        <div className="admin-dashboard-panel-head">
            <h4>{title}</h4>
            {/* « Tout voir » ouvre la page Commandes déjà filtrée sur ce statut */}
            <Link to={`${CLIENT_PATHS.adminOrders}?statut=${status}`}>Tout voir</Link>
        </div>
        {orders.length === 0 ? (
            <p className="admin-dashboard-empty">{emptyText}</p>
        ) : (
            <ul className="admin-dashboard-list">
                {orders.map(order => (
                    <li key={order.order_id ?? order.order_number}>
                        {/* ?commande=<id> : la page Commandes s'ouvre directement sur le détail de cette commande */}
                        <Link className="admin-dashboard-list-link" to={`${CLIENT_PATHS.adminOrders}?commande=${order.order_id}`}>
                            <div>
                                <strong>{order.order_number}</strong>
                                <span>{fullName(order) || '-'} · {formatDate(order.order_date)}</span>
                            </div>
                            <div className="admin-dashboard-list-end">
                                <span className={`purchase-status ${STATUS[order.order_status]?.className || ''}`}>
                                    {STATUS[order.order_status]?.label || order.order_status}
                                </span>
                                <b>{formatPrice(order.order_total_price)}</b>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        )}
    </section>
);

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [ordersList, productsList, usersList] = await Promise.all([
                    fetchList('/order', data => data.results),
                    fetchList('/products', data => data),
                    fetchList('/users', data => data.results),
                ]);
                setOrders(ordersList);
                setProducts(Array.isArray(productsList) ? productsList : []);
                setUsers(usersList);
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || err.response?.data?.error || 'Impossible de charger le tableau de bord');
            } finally {
                setLoaded(true);
            }
        };
        load();
    }, []);

    // ---------- Chiffres clés ----------
    const toShip = orders.filter(order => order.order_status === 'paid');        // payées, à préparer et expédier
    const pending = orders.filter(order => order.order_status === 'pending');    // en attente de paiement

    const now = new Date();
    const revenueThisMonth = orders
        .filter(order => ['paid', 'shipped', 'delivered'].includes(order.order_status))
        .filter(order => {
            const date = new Date(order.order_date);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        })
        .reduce((sum, order) => sum + Number(order.order_total_price || 0), 0);

    const outOfStock = products.filter(product => product.stock <= 0);
    const lowStock = products.filter(product => product.stock > 0 && product.stock <= LOW_STOCK);

    const since = new Date(now.getTime() - NEW_USERS_DAYS * 24 * 60 * 60 * 1000);
    const newUsers = users.filter(user => new Date(user.created_at) >= since);

    // ---------- Encarts ----------
    // les plus anciennes d'abord (ce sont les plus urgentes)
    const oldestFirst = (list) => [...list]
        .sort((a, b) => new Date(a.order_date) - new Date(b.order_date))
        .slice(0, LIST_SIZE);
    const ordersToHandle = oldestFirst(pending);   // « En attente » : à traiter
    const ordersToShip = oldestFirst(toShip);      // « Payé » : à préparer et expédier

    // commandes annulées : les plus récentes d'abord (ce qui vient de se passer)
    const newestFirst = (list) => [...list]
        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
        .slice(0, LIST_SIZE);
    const cancelledOrders = newestFirst(orders.filter(order => order.order_status === 'cancelled'));

    // à réapprovisionner : les ruptures d'abord, puis le stock le plus bas
    const restock = [...outOfStock, ...[...lowStock].sort((a, b) => a.stock - b.stock)].slice(0, LIST_SIZE);

    const lastUsers = [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, LIST_SIZE);

    const tiles = [
        {label: 'Commandes à expédier', value: toShip.length, to: `${CLIENT_PATHS.adminOrders}?statut=paid`, alert: toShip.length > 0},
        {label: 'Commandes en attente de paiement', value: pending.length, to: `${CLIENT_PATHS.adminOrders}?statut=pending`},
        {label: 'Chiffre d\'affaires du mois', value: formatPrice(revenueThisMonth), to: `${CLIENT_PATHS.adminOrders}?statut=revenue&periode=mois`, hint: 'commandes payées'},
        {label: 'Produits en rupture', value: outOfStock.length, to: `${CLIENT_PATHS.adminProducts}?stock=out`, alert: outOfStock.length > 0},
        {label: `Stock bas (≤ ${LOW_STOCK})`, value: lowStock.length, to: `${CLIENT_PATHS.adminProducts}?stock=low`},
        {label: 'Nouveaux inscrits', value: newUsers.length, to: `${CLIENT_PATHS.adminUsers}?inscrits=${NEW_USERS_DAYS}`, hint: `${NEW_USERS_DAYS} derniers jours`},
    ];

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h3 className="font-size-2em c-secondary m-bottom-5px">Tableau de bord</h3>
                <p className="font-size-125em subtitle c-secondary m-0">Ce qui demande votre attention aujourd'hui</p>
            </div>

            {error && <p className="purchase-error">{error}</p>}

            {loaded && !error && (<>
                <div className="admin-dashboard-tiles">
                    {tiles.map(tile => (
                        <Link key={tile.label} to={tile.to}
                              className={`admin-dashboard-tile ${tile.alert ? 'admin-dashboard-tile-alert' : ''}`}>
                            <span className="admin-dashboard-tile-value">{tile.value}</span>
                            <span className="admin-dashboard-tile-label">{tile.label}</span>
                            {tile.hint && <span className="admin-dashboard-tile-hint">{tile.hint}</span>}
                        </Link>
                    ))}
                </div>

                <div className="admin-dashboard-panels">
                    <OrdersPanel title="A expédier" orders={ordersToShip} status="paid"
                                 emptyText="Aucune commande à expédier."/>

                    <OrdersPanel title="En attente de paiement" orders={ordersToHandle} status="pending"
                                 emptyText="Aucune commande en attente."/>

                    <OrdersPanel title="Annulées" orders={cancelledOrders} status="cancelled"
                                 emptyText="Aucune commande annulée."/>

                    <section className="admin-dashboard-panel">
                        <div className="admin-dashboard-panel-head">
                            <h4>À réapprovisionner</h4>
                            <Link to={CLIENT_PATHS.adminProducts}>Tout voir</Link>
                        </div>
                        {restock.length === 0 ? (
                            <p className="admin-dashboard-empty">Aucun produit en rupture ou en stock bas.</p>
                        ) : (
                            <ul className="admin-dashboard-list">
                                {restock.map(product => (
                                    <li key={product.product_id}>
                                        <div>
                                            <strong>{product.product_name}</strong>
                                            <span>{product.category_name}{product.brand_name ? ` · ${product.brand_name}` : ''}</span>
                                        </div>
                                        <div className="admin-dashboard-list-end">
                                            <span className={`admin-dashboard-stock ${product.stock <= 0 ? 'admin-dashboard-stock-out' : 'admin-dashboard-stock-low'}`}>
                                                {product.stock <= 0 ? 'Rupture' : `${product.stock} en stock`}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="admin-dashboard-panel">
                        <div className="admin-dashboard-panel-head">
                            <h4>Derniers inscrits</h4>
                            <Link to={CLIENT_PATHS.adminUsers}>Tout voir</Link>
                        </div>
                        {lastUsers.length === 0 ? (
                            <p className="admin-dashboard-empty">Aucun utilisateur pour le moment.</p>
                        ) : (
                            <ul className="admin-dashboard-list">
                                {lastUsers.map(user => (
                                    <li key={user.id}>
                                        <div>
                                            <strong>{fullName(user) || user.username}</strong>
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="admin-dashboard-list-end">
                                            <span>{formatDate(user.created_at)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </>)}
        </div>
    );
};

export default AdminDashboard;
