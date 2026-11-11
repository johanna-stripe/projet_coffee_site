import React, {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import api from "../axios/axiosConfig.js";
import ProductCard from "../components/product/ProductCard.jsx";
import '../style/productPage.css'
import {searchProducts} from "../helper/search.js";

const SKELETON_COUNT = 4

const SearchPage = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') ?? ''
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // on charge le catalogue une seule fois, le filtrage se fait ensuite dans le navigateur
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setError(null)
                const response = await api.get('/products')
                setProducts(response.data)
            } catch (err) {
                setError('Impossible de charger les produits')
            } finally {
                setLoading(false)
            }
        }
        loadProducts()
    }, [])

    const results = searchProducts(products, query)

    return (
        <main className="product-page">
            <h2>Résultats pour « {query} »</h2>
            {!loading && !error && <p>{results.length} produit(s)</p>}
            <section className="product-grid" aria-busy={loading}>
                {loading
                    ? Array.from({length: SKELETON_COUNT}, (_, i) => <div key={i} className="product-skeleton"/>)
                    : error
                        ? <p>{error}</p>
                        : results.length > 0
                            ? results.map((product) => <ProductCard key={product.product_id} product={product}/>)
                            : <p>Aucun produit ne correspond à votre recherche.</p>}
            </section>
        </main>
    );
};

export default SearchPage;
