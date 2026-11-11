import {Link, Navigate, useLocation} from "react-router-dom";
import {CLIENT_PATHS} from "../routes/paths.js";
import "../style/checkout.css";

const formatPrice = (price) =>
    Number(price).toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})

// Affichée après une commande réussie : la commande arrive par navigate(..., {state: {order}}) depuis CheckoutPage
const OrderConfirmationPage = () => {
    const {state} = useLocation()
    const order = state?.order

    // page ouverte directement (ou rechargée avec F5) : il n'y a pas de commande à afficher
    if (!order) return <Navigate to={CLIENT_PATHS.home} replace/>

    return (
        <main className="checkout-page">
            <div className="confirmation-card">
                <div className="confirmation-header">
                    <h1>Merci pour votre commande !</h1>
                </div>
                <div className="confirmation-body">
                    <p className="checkout-message">Votre commande a bien été enregistrée sous le numéro</p>
                    <span className="confirmation-number">{order.order_number}</span>

                    <p className="checkout-line">
                        <span>Livraison</span>
                        <span>{Number(order.shipping_cost) === 0 ? 'Offerte' : formatPrice(order.shipping_cost)}</span>
                    </p>
                    <p className="checkout-line checkout-total">
                        <span>Total</span><strong>{formatPrice(order.order_total_price)}</strong>
                    </p>

                    <Link to={CLIENT_PATHS.home} className="checkout-submit">Retour à l'accueil</Link>
                </div>
            </div>
        </main>
    )
}
export default OrderConfirmationPage;
