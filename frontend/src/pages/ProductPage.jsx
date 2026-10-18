import React, {useEffect, useState} from 'react';
import api from "../axios/axiosConfig.js";
import ProductCard from "../components/ProductCard.jsx";
import '../style/ProductPage.css'
import ProductHeader from "../components/ProductHeader.jsx";
import ProductFooter from "../components/ProductFooter.jsx";

const ProductPage = ({categoryId, title}) => {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await api.get('/products')
                const filtered = response.data.filter(
                    (product) => product.category_id === categoryId || product.parent_id === categoryId
                );
                setProducts(filtered)
            } catch (err) {
                setError('Impossible de charger les produits')
            } finally {
                setLoading(false)
            }
        };
        loadProducts()
    }, [categoryId]); // la dépendance -> l'effet se relance quand categoryId change


    if (loading) return <p>Chargement...</p>
    if (error) return <p>{error}</p>

    return (
        <>
            <ProductHeader categoryId={categoryId}/>
            <main className="product-page">
                <section className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product.product_id} product={product}/>
                    ))}
                </section>
            </main>
            <ProductFooter categoryId={categoryId}/>
        </>
    );
};

export default ProductPage;