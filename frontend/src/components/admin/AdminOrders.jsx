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

const formatPrice = (value) =>
    value === undefined || value === null ? '-' : `${Number(value).toFixed(2)} €`;


const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

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
                        <th>Statut</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => {
                        const status = STATUS[order.order_status] || {label: order.order_status, className: ''};
                        return (
                        <tr key={order.order_id}>
                            <td className="admin-order-number">{order.order_number}</td>
                            <td>{new Date(order.order_date).toLocaleDateString('fr-FR')}</td>
                            <td>{order.first_name} {order.last_name}</td>
                            <td><span className={`purchase-status ${status.className}`}>{status.label}</span></td>
                            <td className="admin-order-total">{formatPrice(order.order_total_price)}</td>
                        </tr>
                        )
                    })}
                    </tbody>
                </table>
                </div>
            )}
        </div>
    )

}

export default AdminOrders;


