import {Link, Navigate, useLocation} from "react-router-dom";
import {CLIENT_PATHS} from "../routes/paths.js";

const formatPrice = (price) =>
    Number(price).toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})

// Affichée après une commande réussie : la commande arrive par navigate(..., {state: {order}}) depuis CheckoutPage
const OrderConfirmationPage = () => {
    const {state} = useLocation()
    const order = state?.order

    // page ouverte directement (ou rechargée avec F5) : il n'y a pas de commande à afficher
    if (!order) return <Navigate to={CLIENT_PATHS.home} replace/>

    return (
        <main>
            <h1>Merci pour votre commande !</h1>
            <p>Votre commande <strong>{order.order_number}</strong> a bien été enregistrée.</p>
            <p>Frais de livraison : {order.shipping_cost === 0 || Number(order.shipping_cost) === 0 ? 'Offerts' : formatPrice(order.shipping_cost)}</p>
            <p><strong>Total : {formatPrice(order.order_total_price)}</strong></p>
            <Link to={CLIENT_PATHS.home}>Retour à l'accueil</Link>
        </main>
    )
}
export default OrderConfirmationPage;
