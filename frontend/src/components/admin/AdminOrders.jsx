import {useEffect, useState} from "react";
import api from "../../axios/axiosConfig.js";
import "../../style/userPurchases.css";   // réutilise les badges de statut (purchase-status-*)
import "../../style/adminOrders.css";

// Libellé + couleur du badge selon order_status (même logique que "Mes achats")
const STATUS = {
    paid: {label: 'Payé', className: 'purchase-status-paid'},
    pending: {label: 'En attente', className: 'purchase-status-pending'},
    shipped: {label: 'Expédié', className: 'purchase-status-shipped'},
    delivered: {label: 'Livré', className: 'purchase-status-delivered'},
    cancelled: {label: 'Annulé', className: 'purchase-status-cancelled'},
};

const STATUS_OPTIONS = Object.keys(STATUS);

const formatPrice = (value) =>
    value === undefined || value === null ? '-' : `${Number(value).toFixed(2)} €`;


const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);   // le détail de la commande ouverte
    const [detailError, setDetailError] = useState('');

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
                <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>N° commande</th>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Contact</th>
                        <th>Statut</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => {
                        const status = STATUS[order.order_status] || {label: order.order_status, className: ''};
                        return (
                        <tr key={order.order_id}
                        onClick={()=>{openOrder(order.order_id)}}
                            className="admin-row-clickable">
                            <td className="admin-order-number">{order.order_number}</td>
                            <td>{new Date(order.order_date).toLocaleDateString('fr-FR')}</td>
                            <td>{order.first_name} {order.last_name}</td>
                            <td>{order.phone} {order.customer_email}</td>
                            <td><span className={`purchase-status ${status.className}`}>{status.label}</span></td>
                            <td className="admin-order-total">{formatPrice(order.order_total_price)}</td>
                        </tr>
                        )
                    })}
                    </tbody>
                </table>
                </div>
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
                                        onChange={(e) => changeStatus(e.target.value)}>
                                    {STATUS_OPTIONS.map(key => (
                                        <option key={key} value={key}>{STATUS[key].label}</option>
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
        </div>
    )

}

export default AdminOrders;


