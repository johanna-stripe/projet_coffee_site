import {useEffect, useState} from "react";
import {FaChevronDown} from "react-icons/fa";
import api from "../../axios/axiosConfig.js";
import {formatDateLong} from "../../helper/helper.jsx";
import "../../style/userPurchases.css";

// Libellé + couleur du badge selon order_status
const STATUS = {
    paid: {label: 'Payé', className: 'purchase-status-paid'},
    pending: {label: 'En attente', className: 'purchase-status-pending'},
    shipped: {label: 'Expédié', className: 'purchase-status-shipped'},
    delivered: {label: 'Livré', className: 'purchase-status-delivered'},
    cancelled: {label: 'Annulé', className: 'purchase-status-cancelled'},
};

const formatPrice = (value) =>
    value === undefined || value === null ? '-' : `${Number(value).toFixed(2)} €`;

const UserPurchases = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    // Une seule commande dépliée à la fois (null = toutes repliées)
    const [openId, setOpenId] = useState(null);

    //=============== CHARGER LE CLIENT PUIS SES COMMANDES ===============
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const me = await api.get('/customer/me');
                const customerId = me.data.customer.customer_id;
                const response = await api.get(`/order/${customerId}`);
                setOrders(response.data.results || []);
                setError('');
            } catch (err) {
                // 404 = le client n'a encore aucune commande, ce n'est pas une erreur
                if (err.response?.status === 404) {
                    setOrders([]);
                } else {
                    setError(err.response?.data?.error || err.response?.data?.message || 'Impossible de charger vos commandes');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const toggle = (id) => setOpenId(openId === id ? null : id);

    if (isLoading) return <p className="font-size-125em c-secondary">Chargement...</p>;

    return (
        <div className="purchases">
            <div className="purchases-header">
                <h3 className="font-size-2em c-secondary m-bottom-5px">Mes achats</h3>
                <p className="font-size-125em subtitle c-secondary m-0">Historique de vos commandes</p>
            </div>

            {error && <p className="purchase-error">{error}</p>}

            {!error && orders.length === 0 && (
                <p className="font-size-125em c-secondary">Vous n'avez pas encore passé de commande.</p>
            )}

            <div className="purchase-list m-right-20px">
                {orders.map((order) => {
                    const isOpen = openId === order.order_id;
                    const status = STATUS[order.order_status] || {label: order.order_status, className: ''};
                    const items = order.items || [];

                    return (
                        <div className="purchase-card" key={order.order_id}>
                            <button
                                type="button"
                                className="purchase-header"
                                onClick={() => toggle(order.order_id)}
                                aria-expanded={isOpen}
                            >
                                <span className="purchase-header-left">
                                    <span className="purchase-number">{order.order_number}</span>
                                    {order.order_date &&
                                        <span className="purchase-date">{formatDateLong(order.order_date)}</span>}
                                    <span className={`purchase-status ${status.className}`}>{status.label}</span>
                                </span>
                                <span className="purchase-header-right">
                                    <span className="purchase-total">{formatPrice(order.order_total_price)}</span>
                                    <FaChevronDown size={12}
                                                   className={`purchase-chevron ${isOpen ? 'open' : ''}`}/>
                                </span>
                            </button>

                            {isOpen && (
                                <div className="purchase-body">
                                    {items.length === 0 ? (
                                        <p className="purchase-empty">Le détail des articles n'est pas disponible.</p>
                                    ) : (
                                        items.map((item) => (
                                            <div className="purchase-item" key={item.product_id ?? item.product_name}>
                                                <span className="purchase-item-qty">{item.quantity}</span>
                                                <span className="purchase-item-name">{item.product_name}</span>
                                                <span className="purchase-item-price">{formatPrice(item.price)}</span>
                                            </div>
                                        ))
                                    )}

                                    <div className="purchase-footer">
                                        <div className="purchase-actions">
                                            <button type="button" className="purchase-link" disabled>
                                                Télécharger la facture
                                            </button>
                                            <button type="button" className="purchase-link" disabled>
                                                Commander à nouveau
                                            </button>
                                        </div>
                                        <span className="purchase-footer-total">
                                            Total : {formatPrice(order.order_total_price)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserPurchases;
