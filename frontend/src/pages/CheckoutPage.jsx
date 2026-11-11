import {useCart} from "../context/CartContext.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {Navigate, useNavigate} from "react-router-dom";
import {IoShieldCheckmarkOutline} from "react-icons/io5";
import {CLIENT_PATHS} from "../routes/paths.js";
import {useEffect, useState} from "react";
import api from "../axios/axiosConfig.js";
import {getShippingCost, SHIPPING_METHODS} from "../helper/shipping.js";
import "../style/checkout.css";

// value = valeur de l'ENUM payment_method en base ; label et text = affichage
const PAYMENT_METHODS = [
    {value: 'card', label: 'Carte bancaire', text: 'Visa, Mastercard'},
    {value: 'paypal', label: 'PayPal', text: 'Paiement via votre compte PayPal'},
    {value: 'transfer', label: 'Virement', text: 'Commande expédiée à réception du virement'},
]

const formatPrice = (price) =>
    Number(price).toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})

const CheckoutPage = () => {
    const {authLoading, isAuthenticated, isAccountOpen, openAccount} = useAuth()
    const {items, cartLoading, loadCart, openCart} = useCart()
    const navigate = useNavigate()
    const [step, setStep] = useState(1)   // 1 = livraison, 2 = paiement
    const [customerId, setCustomerId] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)   // évite le double clic sur « Valider »
    const [submitError, setSubmitError] = useState('')
    const [addresses, setAddresses] = useState([])
    const [shippingAddressId, setShippingAddressId] = useState(null)   // l'adresse choisie
    const [addressesLoading, setAddressesLoading] = useState(true)
    const [error, setError] = useState('')
    const [sameAsShipping, setSameAsShipping] = useState(true)      // facturation identique à la livraison (cochée par défaut)
    const [billingAddressId, setBillingAddressId] = useState(null)
    const [shippingMethod, setShippingMethod] = useState('standard')   // valeurs de l'ENUM : standard, express
    const [paymentMethod, setPaymentMethod] = useState('card')      // valeurs de l'ENUM : card, paypal, transfer

    // Les hooks (useState, useEffect...) passent TOUJOURS avant les "if ... return"
    useEffect(() => {
        if (isAccountOpen) return   // la fenêtre Mon compte est ouverte : on recharge les adresses à sa fermeture
        // useEffect n'accepte pas une fonction async directement : on en déclare une dedans, puis on l'appelle
        const fetchAddresses = async () => {
            try {
                const response = await api.get('/customer/me')
                const list = response.data.addresses
                setCustomerId(response.data.customer.customer_id)
                setAddresses(list)
                const defaultAddress = list.find(a => a.is_default) || list[0]
                // on garde le choix déjà fait s'il existe encore (adresse modifiée), sinon l'adresse par défaut
                const keepOrDefault = (previousId) =>
                    list.some(a => a.address_id === previousId) ? previousId : (defaultAddress ? defaultAddress.address_id : null)
                setShippingAddressId(keepOrDefault)
                setBillingAddressId(keepOrDefault)   // présélection si la case est décochée plus tard
                setError('')
            } catch (err) {
                setError(err.response?.data?.error || 'Impossible de charger vos adresses');
            } finally {
                setAddressesLoading(false)
            }
        }
        fetchAddresses()
    }, [isAccountOpen]);

    if (authLoading || cartLoading) return <p>Chargement...</p>
    if (!isAuthenticated) return <Navigate to={CLIENT_PATHS.home} replace/>
    if (items.length === 0) return <Navigate to={CLIENT_PATHS.home} replace/>

    // item.price arrive en texte depuis MySQL : Number() avant de multiplier
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    const shippingCost = getShippingCost(subtotal, shippingMethod)
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
                shipping_method: shippingMethod,
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

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    const goToStep = (newStep) => {
        setStep(newStep)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    // Une ligne cliquable avec bouton radio : même rendu pour les adresses, la livraison et le paiement
    // title/text = à gauche, price = à droite (facultatif)
    const renderRow = ({key, name, value, checked, onSelect, title, text, price}) => (
        <label key={key} className={`checkout-row ${checked ? 'checkout-row--selected' : ''}`}>
            <input type="radio" name={name} value={value} checked={checked} onChange={onSelect}/>
            <span className="checkout-row-main">
                <span className="checkout-row-title">{title}</span>
                {text && <span className="checkout-row-text">{text}</span>}
            </span>
            {price && <span className="checkout-row-price">{price}</span>}
        </label>
    )

    const renderAddressRows = (name, selectedId, onSelect) => addresses.map(address => renderRow({
        key: address.address_id,
        name,
        value: address.address_id,
        checked: selectedId === address.address_id,
        onSelect: () => onSelect(address.address_id),
        title: address.address_name,
        text: `${address.street}, ${address.postcode} ${address.city}`,
    }))

    return (
        <main className="checkout-page">
            <div className="checkout-inner">

                {/* Étapes : 01 Livraison, 02 Paiement */}
                <ol className="checkout-stepper">
                    <li className={`checkout-stepper-item ${step === 1 ? 'is-active' : 'is-done'}`}>
                        <button type="button" onClick={() => goToStep(1)} disabled={step === 1}>
                            <span className="checkout-stepper-dot">01</span>
                            <span className="checkout-stepper-label">Livraison</span>
                        </button>
                    </li>
                    <li className="checkout-stepper-line" aria-hidden="true"></li>
                    <li className={`checkout-stepper-item ${step === 2 ? 'is-active' : ''}`}>
                        <span className="checkout-stepper-dot">02</span>
                        <span className="checkout-stepper-label">Paiement</span>
                    </li>
                </ol>

                <div className="checkout-layout">
                    <div className="checkout-main">
                        {/* le panier est un panneau latéral (monté dans App.jsx) : on le rouvre, il n'y a pas de page panier */}
                        <button type="button" className="checkout-return" onClick={openCart}>← Retour au panier</button>

                        {step === 1 && (
                            <>
                                <span className="checkout-eyebrow">Vos coordonnées</span>
                                <h1 className="checkout-title">Où souhaitez-vous être livré ?</h1>
                                <p className="checkout-subtitle">Choisissez une de vos adresses enregistrées.</p>

                                <section className="checkout-card">
                                    <h2 className="checkout-card-title">Adresse de livraison</h2>
                                    {addressesLoading && <p className="checkout-message">Chargement de vos adresses...</p>}
                                    {error && <p className="checkout-error">{error}</p>}
                                    {!addressesLoading && !error && addresses.length === 0 && (
                                        <p className="checkout-message">
                                            Vous n'avez pas encore d'adresse enregistrée. Ajoutez-en une dans votre compte pour commander.
                                        </p>
                                    )}
                                    <div className="checkout-rows">
                                        {renderAddressRows('shipping', shippingAddressId, setShippingAddressId)}
                                    </div>
                                    {/* ouvre la fenêtre Mon compte directement sur l'onglet « Mes adresses » */}
                                    <button type="button" className="checkout-edit-addresses"
                                            onClick={() => openAccount('UserAddresses')}>
                                        Modifier mes adresses
                                    </button>
                                </section>

                                <section className="checkout-card">
                                    <h2 className="checkout-card-title">Mode de livraison</h2>
                                    <div className="checkout-rows">
                                        {SHIPPING_METHODS.map(method => {
                                            const price = getShippingCost(subtotal, method.value)
                                            return renderRow({
                                                key: method.value,
                                                name: 'shippingMethod',
                                                value: method.value,
                                                checked: shippingMethod === method.value,
                                                onSelect: () => setShippingMethod(method.value),
                                                title: method.label,
                                                text: method.delay,
                                                price: price === 0 ? 'Offerte' : formatPrice(price),
                                            })
                                        })}
                                    </div>
                                </section>

                                <button type="button" className="checkout-submit" onClick={() => goToStep(2)}
                                        disabled={!shippingAddressId}>
                                    Continuer vers le paiement
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <span className="checkout-eyebrow">Dernière étape</span>
                                <h1 className="checkout-title">Comment souhaitez-vous payer ?</h1>
                                <p className="checkout-subtitle">Aucun paiement réel n'est effectué sur ce site.</p>

                                <section className="checkout-card">
                                    <h2 className="checkout-card-title">Adresse de facturation</h2>
                                    <label className="checkout-check">
                                        <input type="checkbox" checked={sameAsShipping}
                                               onChange={(e) => setSameAsShipping(e.target.checked)}/>
                                        Identique à l'adresse de livraison
                                    </label>
                                    {/* name="billing" différent de "shipping" : sinon les deux groupes de radios se mélangent */}
                                    {!sameAsShipping && (
                                        <div className="checkout-rows">
                                            {renderAddressRows('billing', billingAddressId, setBillingAddressId)}
                                        </div>
                                    )}
                                </section>

                                <section className="checkout-card">
                                    <h2 className="checkout-card-title">Moyen de paiement</h2>
                                    <div className="checkout-rows">
                                        {PAYMENT_METHODS.map(method => renderRow({
                                            key: method.value,
                                            name: 'payment',
                                            value: method.value,
                                            checked: paymentMethod === method.value,
                                            onSelect: () => setPaymentMethod(method.value),
                                            title: method.label,
                                            text: method.text,
                                        }))}
                                    </div>
                                </section>

                                {submitError && <p className="checkout-error">{submitError}</p>}
                                <button type="button" className="checkout-submit" onClick={handleSubmit} disabled={!canSubmit}>
                                    {isSubmitting ? 'Validation...' : 'Valider la commande'}
                                </button>
                            </>
                        )}
                    </div>

                    <aside className="checkout-summary">
                        <div className="checkout-summary-head">
                            <h2>Votre commande</h2>
                            <span>{itemCount} article(s)</span>
                        </div>

                        <ul className="checkout-items">
                            {items.map(item => (
                                <li key={item.product_id} className="checkout-item">
                                    <div className="checkout-item-image">
                                        <img src={item.product_image_url} alt={item.product_name}/>
                                        <span className="checkout-item-badge">{item.quantity}</span>
                                    </div>
                                    <div>
                                        <p className="checkout-item-name">{item.product_name}</p>
                                        {item.weight && <p className="checkout-item-weight">{Number(item.weight)} g</p>}
                                    </div>
                                    <span className="checkout-item-price">{formatPrice(Number(item.price) * item.quantity)}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="checkout-summary-lines">
                            <p className="checkout-line"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></p>
                            <p className="checkout-line"><span>Livraison</span><span>{shippingCost === 0 ? 'Offerte' : formatPrice(shippingCost)}</span></p>
                        </div>

                        <div className="checkout-summary-total">
                            <span>Total</span>
                            <div>
                                <strong>{formatPrice(total)}</strong>
                                <small>TVA incluse</small>
                            </div>
                        </div>

                        <p className="checkout-note">
                            <IoShieldCheckmarkOutline/>
                            Le paiement est fictif : aucun paiement réel n'est effectué.
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    )
}
export default CheckoutPage;
