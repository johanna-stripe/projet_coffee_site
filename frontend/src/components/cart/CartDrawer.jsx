import {Link} from "react-router-dom";
import {IoClose} from "react-icons/io5";
import {PiBasket} from "react-icons/pi";
import {useCart} from "../../context/CartContext.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {productPath} from "../../routes/paths.js";
import "../../style/cartDrawer.css";

const FREE_SHIPPING_THRESHOLD = 35 // livraison offerte dès 35 € (cf. fiche produit)

const formatPrice = (price) =>
    Number(price).toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})

/*
Panneau latéral du panier : s'ouvre depuis l'icône panier de la NavBar.
Structure : en-tête (titre + nombre d'articles) / liste des produits / pied (totaux + boutons).
*/
const CartDrawer = () => {
    const {items, isCartOpen, closeCart, updateQuantity, removeItem, pendingItem, loginFromCart} = useCart()
    const {isAuthenticated} = useAuth()

    if (!isCartOpen) return null

    // calculés à chaque rendu à partir de items : pas besoin de state
    // item.price arrive en texte depuis MySQL : Number() avant de multiplier
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

    // bandeau de livraison offerte : ce qu'il reste à dépenser, et le remplissage de la barre (plafonné à 100 %)
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
    const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

    return (
        // clic sur le fond sombre = fermeture, comme pour AuthModal
        <div className="cart-overlay" onClick={closeCart}>
            <aside
                className="cart-drawer"
                role="dialog"
                aria-label="Mon panier"
                onClick={(e) => e.stopPropagation()}
                // stopPropagation : un clic dans le panneau ne doit pas remonter jusqu'au fond et le fermer
            >
                <header className="cart-drawer__header">
                    <div>
                        <h2>Mon panier</h2>
                        {isAuthenticated && (
                            <p className="cart-drawer__count">
                                {itemCount} article{itemCount > 1 ? "s" : ""}
                            </p>
                        )}
                    </div>
                    <button type="button" aria-label="Fermer le panier" onClick={closeCart}>
                        <IoClose size={26}/>
                    </button>
                </header>

                {!isAuthenticated ? (
                    // visiteur : pas de panier à montrer, on l'invite à se connecter
                    <div className="cart-drawer__login">
                        <p>
                            {pendingItem
                                ? "Veuillez vous identifier pour ajouter cet article à votre panier."
                                : "Veuillez vous identifier pour consulter votre panier."}
                        </p>
                        <button type="button" className="cart-drawer__checkout" onClick={loginFromCart}>
                            Se connecter
                        </button>
                    </div>
                ) : items.length === 0 ? (
                    <div className="cart-drawer__empty">
                        <PiBasket size={56} className="cart-drawer__empty-icon" aria-hidden="true"/>
                        <p>Votre panier est vide.</p>
                        <p className="c-secondary">Découvrez notre sélection et trouvez votre prochaine pause préférée.</p>
                        {/* le panneau est par-dessus la page : le fermer ramène l'utilisateur là où il était */}
                        <button type="button" className="cart-drawer__checkout" onClick={closeCart}>
                            Découvrez la boutique
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-shipping">
                            <p>
                                {remaining > 0
                                    ? <>Plus que <strong>{formatPrice(remaining)}</strong> pour la livraison offerte</>
                                    : "Livraison offerte !"}
                            </p>
                            <div
                                className="cart-shipping__bar"
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={FREE_SHIPPING_THRESHOLD}
                                aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)}>
                                <div className="cart-shipping__fill" style={{width: `${shippingProgress}%`}}/>
                            </div>
                        </div>

                        <ul className="cart-drawer__list">
                            {items.map((item) => (
                                <li key={item.product_id} className="cart-item">
                                    <Link to={productPath(item.product_id)} onClick={closeCart}>
                                        <img src={item.product_image_url} alt={item.product_name}/>
                                    </Link>

                                    <div className="cart-item__info">
                                        {/* origine et poids n'existent que pour café / thé / infusion (null sinon) */}
                                        {item.origin && <p className="cart-item__origin">{item.origin}</p>}
                                        <p className="cart-item__name">{item.product_name}</p>
                                        {item.weight && <p className="cart-item__weight">{Number(item.weight)} g</p>}

                                        <div className="cart-item__quantity">
                                            <button
                                                type="button"
                                                aria-label="Diminuer la quantité"
                                                disabled={item.quantity <= 1}
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>−
                                            </button>
                                            <span aria-live="polite">{item.quantity}</span>
                                            <button
                                                type="button"
                                                aria-label="Augmenter la quantité"
                                                disabled={item.quantity >= item.stock}
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item__side">
                                        <button
                                            type="button"
                                            aria-label={`Retirer ${item.product_name} du panier`}
                                            onClick={() => removeItem(item.product_id)}>
                                            <IoClose size={18}/>
                                        </button>
                                        <p className="cart-item__price">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <footer className="cart-drawer__footer">
                            <p className="cart-drawer__line">
                                <span>Sous-total</span>
                                <span>{formatPrice(subtotal)}</span>
                            </p>
                            <p className="cart-drawer__line">
                                <span>Livraison</span>
                                <span>Calculée à l'étape suivante</span>
                            </p>
                            <hr/>
                            <p className="cart-drawer__line cart-drawer__total">
                                <span>Total</span>
                                <strong>{formatPrice(subtotal)}</strong>
                            </p>
                            {/* le bouton sera branché quand la page de commande existera */}
                            <button type="button" className="cart-drawer__checkout">Passer la commande</button>
                            <button type="button" className="cart-drawer__continue" onClick={closeCart}>
                                Continuer mes achats
                            </button>
                        </footer>
                    </>
                )}
            </aside>
        </div>
    )
}

export default CartDrawer
