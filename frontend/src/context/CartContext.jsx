import {createContext, useContext, useEffect, useState} from "react";
import api from "../axios/axiosConfig.js";
import {useAuth} from "./AuthContext.jsx";

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const {user, openAuthModal} = useAuth()

    const [cartId, setCartId] = useState(null)
    const [items, setItems] = useState([])
    const [cartLoading, setCartLoading] = useState(true)
    const [isCartOpen, setIsCartOpen] = useState(false) // panneau latéral du panier ouvert ou fermé
    const [pendingItem, setPendingItem] = useState(null)
    // article qu'un visiteur non connecté voulait ajouter : on le garde pour l'ajouter dès qu'il est connecté

    const loadCart = async () => {
        try {
            if (!user) {
                setCartId(null)
                setItems([])
                return
            }
            const response = await api.get(`/cart/${user.customer_id}`)

            setCartId(response.data.results.cart_id)
            setItems(response.data.results.items)

        } catch (error) {
            setCartId(null)
            setItems([])
        } finally {
            setCartLoading(false)
        }
    }

    const addToCart = async (product_id, quantity = 1) => {
        // pas connecté : rien à envoyer. On mémorise l'article et on ouvre le panneau,
        // qui invite le visiteur à se connecter (cf. CartDrawer)
        if (!user) {
            setPendingItem({product_id, quantity})
            setIsCartOpen(true)
            return false
        }

        try {
            await api.post(`/cart/${user.customer_id}`, {product_id, quantity})

            // la réponse du POST ne contient pas le panier : on le recharge pour avoir l'état à jour
            await loadCart()
            setIsCartOpen(true) // le panneau s'ouvre pour montrer ce qui vient d'être ajouté
            return true
        } catch (error) {
            // on ne touche pas au state : le panier en base n'a pas changé
            console.log(error)
            return false
        }
    }

    const updateQuantity = async (product_id, quantity) => {
        // pas de panier, ou quantité < 1 : rien à envoyer (le bouton − est désactivé à 1)
        if (!cartId || quantity < 1) return false

        try {
            // le product_id est déjà dans l'URL : le back ne lit que la quantité
            await api.patch(`/cart/${cartId}/product/${product_id}`, {quantity})

            await loadCart()
            return true

        } catch (error) {
            // on ne touche pas au state : le panier en base n'a pas changé
            console.log(error)
            return false
        }
    }

    const removeItem = async (product_id) => {
        if (!cartId) return false

        try {
            await api.delete(`/cart/${cartId}/product/${product_id}`)

            await loadCart()
            return true

        } catch (error) {
            console.log(error)
            return false
        }
    }

    // depuis le panneau : on le ferme (sans oublier l'article en attente) puis on ouvre la modale de connexion
    const loginFromCart = () => {
        setIsCartOpen(false)
        openAuthModal()
    }

    const closeCart = () => {
        setIsCartOpen(false)
        setPendingItem(null) // le visiteur a abandonné : on n'ajoutera rien après une connexion ultérieure
    }

    useEffect(() => {
        const restoreCart = async () => {
            await loadCart()

            // le visiteur vient de se connecter : on ajoute ce qu'il voulait mettre au panier
            if (user && pendingItem) {
                const {product_id, quantity} = pendingItem
                setPendingItem(null)
                if (await addToCart(product_id, quantity)) setIsCartOpen(true)
            }
        }
        restoreCart()
    }, [user])

    return (
        <CartContext.Provider
            value={{
                cartId,
                items,
                cartLoading,
                isCartOpen,
                pendingItem,
                openCart: () => setIsCartOpen(true),
                closeCart,
                loginFromCart,
                addToCart,
                updateQuantity,
                removeItem,
                loadCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )

}

export const useCart = () => {
    return useContext(CartContext)
}


