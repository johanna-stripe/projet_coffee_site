import React, {useState} from "react";
import {Link} from "react-router-dom";
import {CATEGORIES, CLIENT_PATHS} from "../../routes/paths.js";
import '../../style/productDetail.css'

const formatPrice = (price) =>
    Number(price).toLocaleString('fr-FR', {style: 'currency', currency: 'EUR'})

/*
Fiche détaillée d'un produit (la "grande" carte, à ne pas confondre avec ProductCard, la vignette des listes).

`product` = une ligne renvoyée par GET /products (product_name, product_image_url, price, stock, origin, roast, weight...).
Les blocs suivants ne s'affichent que si la donnée existe dans `product` (aucune n'est en base pour l'instant) :
  - altitude                          → "ÉTHIOPIE · ALTITUDE 2 100 M"
  - rating + reviews_count            → étoiles et "(128 avis)"
  - aromas (tableau de strings)       → "Profil aromatique"
  - brew {temperature, duration, dosage} → bandeau température / durée / dosage
`onAddToCart(product, quantity)` est appelé au clic sur "Ajouter au panier".
*/
const ProductDetail = ({product, onAddToCart}) => {
    const [quantity, setQuantity] = useState(1)

    const inStock = product.stock > 0

    const maxQuantity = inStock ? product.stock : 1
    // si le produit est en stock (inStock), le maximum est la quantité en stock, par exemple 12 ;
    // sinon, le maximum est 1.

    const category = CATEGORIES.find((c) => c.id === product.category_id || c.id === product.parent_id)
    // l’id de la catégorie est celui du produit (category_id) ou celui de sa catégorie parente (parent_id). Le || veut dire « ou ».

    const rating = Math.round(Number(product.rating)) || 0
    // note sur 5 : 0 si le produit n'a pas de note en base (le bloc des étoiles ne s'affiche alors pas)

    return (
        <section className="product-detail">
            <nav className="product-detail__breadcrumb" aria-label="Fil d'Ariane">
                <Link to={CLIENT_PATHS.home}>La boutique</Link>
                {category && (
                    <>
                        <span aria-hidden="true">/</span>
                        <Link to={category.path}>{category.title}</Link>
                    </>
                )}
                <span aria-hidden="true">/</span>
                <span aria-current="page">{product.product_name}</span>
            </nav>

            <div className="product-detail__layout">
                <figure className="product-detail__media">
                    <div className="product-detail__image-wrapper">
                        <img
                            className="product-detail__image"
                            src={product.product_image_url}
                            alt={product.product_name}
                        />
                        {product.roast && <span className="product-detail__badge">{product.roast}</span>}
                    </div>
                    <figcaption className="product-detail__caption">
                        Sélectionné et préparé avec soin dans notre atelier en Provence
                    </figcaption>
                </figure>

                <div className="product-detail__info">
                    {product.origin && (
                        <p className="product-detail__eyebrow">
                            {product.origin}{product.altitude && ` · Altitude ${product.altitude} m`}
                        </p>
                    )}
                    <h1 className="product-detail__title">{product.product_name}</h1>

                    {rating > 0 && (
                        <p className="product-detail__rating" aria-label={`Note : ${rating} sur 5`}>
                            <span className="product-detail__stars" aria-hidden="true">
                                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                            </span>
                            {product.reviews_count > 0 && <span>({product.reviews_count} avis)</span>}
                        </p>
                    )}

                    <hr className="product-detail__rule"/>

                    <p className="product-detail__description">{product.product_description}</p>

                    {product.aromas?.length > 0 && (
                        <div className="product-detail__aromas">
                            <p className="product-detail__label">Profil aromatique</p>
                            <ul>
                                {product.aromas.map((aroma) => <li key={aroma}>{aroma}</li>)}
                            </ul>
                        </div>
                    )}

                    {product.weight && (
                        <div className="product-detail__row">
                            <span className="product-detail__label">Conditionnement</span>
                            <span>{Number(product.weight)} g</span>
                        </div>
                    )}

                    <div className="product-detail__buy">
                        <div>
                            <p className="product-detail__price">{formatPrice(product.price)}</p>
                            <p className={`product-detail__stock ${inStock ? '' : 'product-detail__stock--out'}`}>
                                {inStock ? 'En stock · expédié sous 48 h' : 'Rupture de stock'}
                            </p>
                        </div>

                        <div className="product-detail__quantity">
                            <button
                                type="button"
                                aria-label="Diminuer la quantité"
                                disabled={quantity <= 1}
                                onClick={() => setQuantity((q) => q - 1)}>−
                            </button>
                            <span aria-live="polite">{quantity}</span>
                            <button
                                type="button"
                                aria-label="Augmenter la quantité"
                                disabled={quantity >= maxQuantity}
                                onClick={() => setQuantity((q) => q + 1)}>+
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="product-detail__cart"
                        disabled={!inStock}
                        onClick={async () => {
                            const added = await onAddToCart?.(product, quantity)
                            if (added) setQuantity(1) // retour à 1 une fois ajouté
                        }}>
                        Ajouter au panier
                    </button>
                    <p className="product-detail__reassurance">Livraison standard offerte dès 35 € · paiement sécurisé</p>

                    {product.brew && (
                        <dl className="product-detail__brew">
                            <div>
                                <dd>{product.brew.temperature}</dd>
                                <dt>Température</dt>
                            </div>
                            <div>
                                <dd>{product.brew.duration}</dd>
                                <dt>Durée</dt>
                            </div>
                            <div>
                                <dd>{product.brew.dosage}</dd>
                                <dt>Dosage</dt>
                            </div>
                        </dl>
                    )}

                    <details className="product-detail__accordion" open>
                        <summary>Détails du produit</summary>
                        <p>
                            {[
                                product.origin,
                                product.altitude && `Altitude ${product.altitude} m`,
                                product.aromas?.length > 0 && `${product.aromas.join(', ')}`,
                            ].filter(Boolean).join(' · ')}
                            {product.origin ? '. ' : ''}Conditionné avec soin pour préserver toutes ses qualités jusqu'à votre tasse.
                        </p>
                    </details>

                    <details className="product-detail__accordion" open>
                        <summary>Livraison &amp; retours</summary>
                        <p>
                            Expédition sous 48 heures. Livraison standard offerte en France métropolitaine dès 35 € et retours
                            possibles sous 14 jours.
                        </p>
                    </details>
                </div>
            </div>
        </section>
    )
}

export default ProductDetail
