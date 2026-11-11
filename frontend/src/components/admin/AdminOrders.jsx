import {useEffect, useState} from "react";
import api from "../../axios/axiosConfig.js";
import "../../style/userPurchases.css";   // réutilise les badges de statut (purchase-status-*)
import "../../style/adminOrders.css";
import ConfirmModal from "./ConfirmModal.jsx";

// Libellé + couleur du badge selon order_status (même logique que "Mes achats")
const STATUS = {
    paid: {label: 'Payé', className: 'purchase-status-paid'},
    pending: {label: 'En attente', className: 'purchase-status-pending'},
    shipped: {label: 'Expédié', className: 'purchase-status-shipped'},
    delivered: {label: 'Livré', className: 'purchase-status-delivered'},
    cancelled: {label: 'Annulé', className: 'purchase-status-cancelled'},
};

const STATUS_OPTIONS = Object.keys(STATUS);

const PAGE_SIZE = 10;   // commandes affichées par page

const SHIPPING_METHOD_LABELS = {standard: 'Standard', express: 'Express'};

const formatPrice = (value) =>
    value === undefined || value === null ? '-' : `${Number(value).toFixed(2)} €`;


const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);   // le détail de la commande ouverte
    const [detailError, setDetailError] = useState('');
    const [confirmCancel, setConfirmCancel] = useState(false);   // fenêtre « annuler la commande ? » ouverte ou non
    const [search, setSearch] = useState('');                    // texte tapé dans la recherche par n° de commande

    const [statusFilter, setStatusFilter] = useState('all');     // 'all' ou une clé de STATUS
    const [sortBy, setSortBy] = useState('date-desc');           // critère de tri choisi
    const [page, setPage] = useState(1);                         // page affichée (1 = la première)

    // Minuscules + sans accents : "Éloïse" et "eloise" se trouvent mutuellement
    const normalize = (text) => (text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    // Filtre sur le numéro, le nom du client (prénom + nom, dans les deux sens) ou son email :
    // "0012", "cmd-2026", "dupont", "marie dup", "dupont marie" ...
    // puis sur le statut, puis tri. filter() renvoie un nouveau tableau : sort() ne modifie donc pas l'état `orders`.
    const visibleOrders = orders
        .filter(order => {
            const words = normalize(search).split(/\s+/).filter(Boolean);   // chaque mot tapé doit se retrouver quelque part
            const haystack = normalize(
                `${order.order_number} ${order.first_name} ${order.last_name} ${order.last_name} ${order.first_name} ${order.customer_email}`
            );
            return words.every(word => haystack.includes(word));
        })
        .filter(order => statusFilter === 'all' || order.order_status === statusFilter)
        .sort((a, b) => {
            switch (sortBy) {
                case 'date-asc':
                    return new Date(a.order_date) - new Date(b.order_date);
                case 'total-desc':
                    return Number(b.order_total_price) - Number(a.order_total_price);
                case 'total-asc':
                    return Number(a.order_total_price) - Number(b.order_total_price);
                default:   // 'date-desc'
                    return new Date(b.order_date) - new Date(a.order_date);
            }
        });

    // Pagination : on découpe la liste déjà filtrée et triée.
    // Math.min : si un filtre réduit la liste, on ne reste pas sur une page qui n'existe plus.
    const totalPages = Math.max(1, Math.ceil(visibleOrders.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageOrders = visibleOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/order')
                setOrders(response.data.results || [])
                setError('')
            } catch (err) {
                if (err.response?.status === 404) {
                    setOrders([]);
                } else {
                    setError(err.response?.data?.error || err.response?.data?.message || 'Impossible de charger vos commandes');
                }
            }
        }
        fetchOrders()
    }, []);

    const openOrder = async (orderId) => {
        try {
            const response = await api.get(`/order/detail/${orderId}`)
            setSelectedOrder(response.data.results)
            setDetailError('')
        } catch (err) {
            setDetailError(err.response?.data?.message || 'Impossible de charger la commande');
        }
    };

    // Change le statut de la commande ouverte puis met à jour le panneau ET le tableau
    // Choix dans le select : l'annulation passe d'abord par la fenêtre de confirmation
    const handleStatusSelect = (newStatus) => {
        if (newStatus === 'cancelled') {
            setConfirmCancel(true)   // le select est contrôlé : il reste sur l'ancien statut tant qu'on n'a pas confirmé
        } else {
            changeStatus(newStatus)
        }
    };

    const changeStatus = async (newStatus) => {
        try {
            await api.patch(`/order/${selectedOrder.order_id}`, {order_status: newStatus})
            setSelectedOrder({...selectedOrder, order_status: newStatus})
            setOrders(orders.map(order =>
                order.order_id === selectedOrder.order_id ? {...order, order_status: newStatus} : order
            ))
            setDetailError('')
        } catch (err) {
            setDetailError(err.response?.data?.error || err.response?.data?.message || 'Impossible de modifier le statut');
        }
    };

    return (
        <div className="admin-orders">
            <div className="admin-orders-header">
                <h3 className="font-size-2em c-secondary m-bottom-5px">Commandes récentes</h3>
                <p className="font-size-125em subtitle c-secondary m-0">Les dernières ventes de la boutique</p>
            </div>
            {error && <p className="purchase-error">{error}</p>}

            {!error && orders.length === 0 && (
                <p className="font-size-125em c-secondary">Aucun client n'a encore passé de commande.</p>
            )}

            {orders.length > 0 && (
                <div className="admin-toolbar">
                    <input type="search" className="admin-search" placeholder="Rechercher un n° de commande ou un client"
                           aria-label="Rechercher une commande par numéro ou par client"
                           value={search} onChange={(e) => {setSearch(e.target.value); setPage(1)}}/>

                    <select className="admin-status-select" aria-label="Filtrer par statut"
                            value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setPage(1)}}>
                        <option value="all">Tous les statuts</option>
                        {STATUS_OPTIONS.map(key => (
                            <option key={key} value={key}>{STATUS[key].label}</option>
                        ))}
                    </select>

                    <select className="admin-status-select" aria-label="Trier les commandes"
                            value={sortBy} onChange={(e) => {setSortBy(e.target.value); setPage(1)}}>
                        <option value="date-desc">Plus récentes d'abord</option>
                        <option value="date-asc">Plus anciennes d'abord</option>
                        <option value="total-desc">Total décroissant</option>
                        <option value="total-asc">Total croissant</option>
                    </select>
                </div>
            )}

            {orders.length > 0 && visibleOrders.length === 0 && (
                <p className="font-size-125em c-secondary">Aucune commande ne correspond à votre recherche.</p>
            )}

            {visibleOrders.length > 0 && (
                <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>N° commande</th>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Statut</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pageOrders.map(order => {
                        const status = STATUS[order.order_status] || {label: order.order_status, className: ''};
                        return (
                        <tr key={order.order_id}
                        onClick={()=>{openOrder(order.order_id)}}
                            className="admin-row-clickable">
                            <td className="admin-order-number">{order.order_number}</td>
                            <td>{new Date(order.order_date).toLocaleDateString('fr-FR')}</td>
                            <td>{order.first_name} {order.last_name}</td>
                            <td>{order.customer_email}</td>
                            <td>{order.phone}</td>
                            <td><span className={`purchase-status ${status.className}`}>{status.label}</span></td>
                            <td className="admin-order-total">{formatPrice(order.order_total_price)}</td>
                        </tr>
                        )
                    })}
                    </tbody>
                </table>
                </div>
            )}

            {totalPages > 1 && (
                <nav className="admin-pagination" aria-label="Pagination des commandes">
                    <button type="button" className="admin-pagination-btn"
                            disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                        ← Précédent
                    </button>
                    <span className="admin-pagination-info">
                        Page {currentPage} / {totalPages} · {visibleOrders.length} commandes
                    </span>
                    <button type="button" className="admin-pagination-btn"
                            disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
                        Suivant →
                    </button>
                </nav>
            )}
            {detailError && <p className="purchase-error">{detailError}</p>}

            {selectedOrder && (() => {
                const detailStatus = STATUS[selectedOrder.order_status] || {label: selectedOrder.order_status, className: ''};
                const itemsTotal = selectedOrder.items.reduce((sum, item) => sum + item.quantity * Number(item.unit_price), 0);
                return (
                <div className="admin-order-detail">
                    <div className="admin-order-detail-head">
                        <div>
                            <h4 className="admin-order-detail-title">Commande {selectedOrder.order_number}</h4>
                            <span className={`purchase-status ${detailStatus.className}`}>{detailStatus.label}</span>
                        </div>
                        <button type="button" className="admin-order-detail-close" aria-label="Fermer"
                                onClick={() => setSelectedOrder(null)}>✕</button>
                    </div>

                    <dl className="admin-order-detail-info">
                        <div>
                            <dt>Statut</dt>
                            <dd>
                                <select className="admin-status-select" value={selectedOrder.order_status}
                                        onChange={(e) => handleStatusSelect(e.target.value)}>
                                    {STATUS_OPTIONS.map(key => (
                                        <option key={key} value={key}
                                                disabled={selectedOrder.order_status === 'cancelled' && key !== 'cancelled'}>
                                            {STATUS[key].label}
                                        </option>
                                    ))}
                                </select>
                            </dd>
                        </div>
                        <div>
                            <dt>Date</dt>
                            <dd>{new Date(selectedOrder.order_date).toLocaleDateString('fr-FR')}</dd>
                        </div>
                        <div>
                            <dt>Paiement</dt>
                            <dd>{selectedOrder.payment_method || '-'}</dd>
                        </div>
                        <div>
                            <dt>Livraison</dt>
                            <dd>{SHIPPING_METHOD_LABELS[selectedOrder.shipping_method] || '-'}</dd>
                        </div>
                        <div>
                            <dt>Frais de port</dt>
                            <dd>{formatPrice(selectedOrder.shipping_cost)}</dd>
                        </div>
                    </dl>

                    <h5 className="admin-order-detail-subtitle">Articles</h5>
                    {selectedOrder.items.length === 0 ? (
                        <p className="purchase-empty">Aucun article enregistré pour cette commande.</p>
                    ) : (
                        <ul className="admin-order-items">
                            {selectedOrder.items.map(item => (
                                <li key={item.product_id} className="admin-order-item">
                                    <span className="purchase-item-qty">{item.quantity}</span>
                                    <span className="purchase-item-name">{item.product_name}</span>
                                    <span>{formatPrice(item.unit_price)}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {selectedOrder.items.length > 0 && (
                        <p className="admin-order-detail-total">Articles : {formatPrice(itemsTotal)}</p>
                    )}
                </div>
                )
            })()}

            <ConfirmModal
                isOpen={confirmCancel && !!selectedOrder}
                title="Annuler la commande"
                message={<>
                    Êtes-vous sûr de vouloir annuler <strong>la commande {selectedOrder?.order_number}</strong> ?
                    Cette action est <strong>irréversible</strong> : le stock des articles sera remis en vente et la commande ne pourra plus être modifiée.
                </>}
                confirmLabel="Annuler la commande"
                cancelLabel="Retour"
                onCancel={() => setConfirmCancel(false)}
                onConfirm={() => {
                    setConfirmCancel(false)
                    changeStatus('cancelled')
                }}
            />
        </div>
    )

}

export default AdminOrders;


