import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import api from "../axios/axiosConfig.js";
import ProductDetail from "../components/product/ProductDetail.jsx";
import ProductReviews from "../components/product/ProductReviews.jsx";
import {useCart} from "../context/CartContext.jsx";

const ProductDetailPage = () => {
    const {addToCart} = useCart()
    const {id} = useParams() // l'id vient de l'URL : /produit/:id
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true)
                setError(null)
                // GET /products renvoie image, catégorie, marque... que GET /products/:id n'a pas
                const response = await api.get('/products')
                const found = response.data.find((p) => String(p.product_id) === id)
                if (!found) setError('Produit introuvable')
                setProduct(found ?? null)
            } catch (err) {
                setError('Impossible de charger le produit')
            } finally {
                setLoading(false)
            }
        }
        loadProduct()
    }, [id]) // se relance à chaque changement d'id : un clic sur un autre produit met la fiche à jour

    if (loading) return <p>Chargement...</p>
    if (error) return <p>{error}</p>

    // key : quand on change de produit, React recrée le composant (la quantité repart à 1)
    // ProductDetail renvoie (product, quantity) alors que addToCart attend (product_id, quantity)
    return (
        <>
            <ProductDetail
                key={product.product_id}
                product={product}
                onAddToCart={(product, quantity) => addToCart(product.product_id, quantity)}
            />
            {/* avis clients, stockés dans MongoDB */}
            <ProductReviews key={`reviews-${product.product_id}`} productId={product.product_id}/>
        </>
    )
};

export default ProductDetailPage;
