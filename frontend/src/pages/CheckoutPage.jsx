import {useCart} from "../context/CartContext.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {Navigate, useNavigate} from "react-router-dom";
import {CLIENT_PATHS} from "../routes/paths.js";
import {useEffect, useState} from "react";
import api from "../axios/axiosConfig.js";
import {getShippingCost} from "../helper/shipping.js";

const formatPrice = (price) =>
    Number(price).toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})

const CheckoutPage = () => {
    const {authLoading, isAuthenticated} = useAuth()
    const {items, cartLoading, loadCart} = useCart()
    const navigate = useNavigate()
    const [customerId, setCustomerId] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)   // évite le double clic sur « Valider »
    const [submitError, setSubmitError] = useState('')
    const [addresses, setAddresses] = useState([])
    const [shippingAddressId, setShippingAddressId] = useState(null)   // l'adresse choisie
    const [addressesLoading, setAddressesLoading] = useState(true)
    const [error, setError] = useState('')
    const [sameAsShipping, setSameAsShipping] = useState(true)      // facturation identique à la livraison (cochée par défaut)
    const [billingAddressId, setBillingAddressId] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('card')      // valeurs de l'ENUM : card, paypal, transfer

    // Les hooks (useState, useEffect...) passent TOUJOURS avant les "if ... return"
    useEffect(() => {
        // useEffect n'accepte pas une fonction async directement : on en déclare une dedans, puis on l'appelle
        const fetchAddresses = async () => {
            try {
                const response = await api.get('/customer/me')
                const list = response.data.addresses
                setCustomerId(response.data.customer.customer_id)
                setAddresses(list)
                const defaultAddress = list.find(a => a.is_default) || list[0]
                if (defaultAddress) {
                    setShippingAddressId(defaultAddress.address_id)
                    setBillingAddressId(defaultAddress.address_id)   // présélection si la case est décochée plus tard
                }
                setError('')
            } catch (err) {
                setError(err.response?.data?.error || 'Impossible de charger vos adresses');
            } finally {
                setAddressesLoading(false)
            }
        }
        fetchAddresses()
    }, []);

    if (authLoading || cartLoading) return <p>Chargement...</p>
    if (!isAuthenticated) return <Navigate to={CLIENT_PATHS.home} replace/>
    if (items.length === 0) return <Navigate to={CLIENT_PATHS.home} replace/>

    // item.price arrive en texte depuis MySQL : Number() avant de multiplier
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    const shippingCost = getShippingCost(subtotal)
    const total = subtotal + shippingCost

    const billingId = sameAsShipping ? shippingAddressId : billingAddressId
    const canSubmit = Boolean(customerId && shippingAddressId && billingId) && !isSubmitting

    // Le client n'envoie que les adresses et le moyen de paiement : le serveur recalcule articles, frais et total
    const handleSubmit = async () => {
        setIsSubmitting(true)
        setSubmitError('')
        try {
            const response = await api.post(`/order/${customerId}`, {
                shipping_address_id: shippingAddressId,
                billing_address_id: billingId,
                payment_method: paymentMethod,
            })
            // on change de page AVANT de recharger le panier : panier vide + page Commande = redirection vers l'accueil
            navigate(CLIENT_PATHS.orderConfirmation, {state: {order: response.data.results}})
            loadCart()
        } catch (err) {
            setSubmitError(err.response?.data?.message || err.response?.data?.error || 'Impossible de valider la commande')
            setIsSubmitting(false)
        }
    }

    return (
        <main>
            <h1>Commande</h1>

            <h2>Adresse de livraison</h2>
            {addressesLoading && <p>Chargement de vos adresses...</p>}
            {error && <p>{error}</p>}
            {!addressesLoading && !error && addresses.length === 0 && (
                <p>Vous n'avez pas encore d'adresse enregistrée. Ajoutez-en une dans votre compte pour commander.</p>
            )}

            {addresses.map(address => (
                <label key={address.address_id}>
                    <input type="radio" name="shipping" value={address.address_id}
                           checked={shippingAddressId === address.address_id}
                           onChange={() => setShippingAddressId(address.address_id)}/>
                    {address.address_name} : {address.street}, {address.postcode} {address.city}
                </label>
            ))}

            <h2>Adresse de facturation</h2>
            <label>
                <input type="checkbox" checked={sameAsShipping}
                       onChange={(e) => setSameAsShipping(e.target.checked)}/>
                Identique à l'adresse de livraison
            </label>

            {/* name="billing" différent de "shipping" : sinon les deux groupes de radios se mélangent */}
            {!sameAsShipping && addresses.map(address => (
                <label key={address.address_id}>
                    <input type="radio" name="billing" value={address.address_id}
                           checked={billingAddressId === address.address_id}
                           onChange={() => setBillingAddressId(address.address_id)}/>
                    {address.address_name} : {address.street}, {address.postcode} {address.city}
                </label>
            ))}

            <h2>Moyen de paiement</h2>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="card">Carte bancaire</option>
                <option value="paypal">PayPal</option>
                <option value="transfer">Virement</option>
            </select>

            <h2>Récapitulatif</h2>
            <ul>
                {items.map(item => (
                    <li key={item.product_id}>
                        {item.quantity} × {item.product_name} : {formatPrice(Number(item.price) * item.quantity)}
                    </li>
                ))}
            </ul>
            <p>Sous-total : {formatPrice(subtotal)}</p>
            <p>Livraison : {shippingCost === 0 ? 'Offerte' : formatPrice(shippingCost)}</p>
            <p><strong>Total : {formatPrice(total)}</strong></p>

            {submitError && <p>{submitError}</p>}
            <button type="button" onClick={handleSubmit} disabled={!canSubmit}>
                {isSubmitting ? 'Validation...' : 'Valider la commande'}
            </button>
        </main>
    )
}
export default CheckoutPage;
