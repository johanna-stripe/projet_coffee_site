import {useCart} from "../context/CartContext.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {Navigate} from "react-router-dom";
import {CLIENT_PATHS} from "../routes/paths.js";
import {useEffect, useState} from "react";
import api from "../axios/axiosConfig.js";

const CheckoutPage = () => {
    const {authLoading, isAuthenticated} = useAuth()
    const {items, cartLoading} = useCart()
    const [addresses, setAddresses] = useState([])
    const [shippingAddressId, setShippingAddressId] = useState(null)   // l'adresse choisie
    const [addressesLoading, setAddressesLoading] = useState(true)
    const [error, setError] = useState('')

    // Les hooks (useState, useEffect...) passent TOUJOURS avant les "if ... return"
    useEffect(() => {
        // useEffect n'accepte pas une fonction async directement : on en déclare une dedans, puis on l'appelle
        const fetchAddresses = async () => {
            try {
                const response = await api.get('/customer/me')
                const list = response.data.addresses
                setAddresses(list)
                const defaultAddress = list.find(a => a.is_default) || list[0]
                if (defaultAddress) setShippingAddressId(defaultAddress.address_id)
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
        </main>
    )
}
export default CheckoutPage;
