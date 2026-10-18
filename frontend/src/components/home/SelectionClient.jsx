import React, {useEffect, useState} from "react";
import api from "../../axios/axiosConfig.js";
import ProductCard from "../product/ProductCard.jsx";
import {Link} from "react-router-dom";
import {CLIENT_PATHS} from "../../routes/paths.js";
import '../../style/productPage.css' // styles de .product-card (partagés avec la page produits)

// ids de CATEGORIES dans routes/paths.js
const CATEGORY_COFFEE_BEANS = 1
const CATEGORY_GROUND_COFFEE = 2
const BEANS_COUNT = 3
const GROUND_COUNT = 2

const belongsTo = (product, categoryId) =>
    product.category_id === categoryId || product.parent_id === categoryId

// Pas encore d'avis clients : en attendant, on met en avant les 3 premiers cafés en grains
// et les 2 premiers cafés moulus de la base, avec exactement la même carte que la page produits.
const SelectionClient = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await api.get('/products')
                const beans = response.data.filter((p) => belongsTo(p, CATEGORY_COFFEE_BEANS)).slice(0, BEANS_COUNT)
                const ground = response.data.filter((p) => belongsTo(p, CATEGORY_GROUND_COFFEE)).slice(0, GROUND_COUNT)
                setProducts([...beans, ...ground])
            } catch (err) {
                setProducts([]) // en cas d'erreur, on n'affiche simplement pas la section
            }
        }
        loadProducts()
    }, [])

    if (products.length === 0) return null

    return (
        <section className="selection-client flex flex-direction-column justify-content-center align-items-center b-secondary">
            <p className="c-tertiary font-size-150em m-0 slider-eyebrow m-10px">Notre sélection</p>
            <h2 className="c-primary m-0">Nos coups de cœur du moment</h2>
            <div className="selection-client__list">
                {products.map((product) => (
                    <div key={product.product_id} className="selection-client__item b-primary">
                        <ProductCard product={product}/>
                    </div>
                ))}
            </div>
            <Link to={CLIENT_PATHS.cafeGrain} className="selection-client__more">
                Voir tous nos cafés
            </Link>
        </section>
    )
}

export default SelectionClient
