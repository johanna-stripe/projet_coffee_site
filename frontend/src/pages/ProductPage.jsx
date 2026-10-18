import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import api from "../axios/axiosConfig.js";
import ProductCard from "../components/product/ProductCard.jsx";
import '../style/productPage.css'
import ProductHeader from "../components/product/ProductHeader.jsx";
import ProductFooter from "../components/product/ProductFooter.jsx";

// 1er filtre (au-dessus) : la sous-catégorie, = category_name en base (en minuscules)
const FILTERED_CATEGORY = {
    1: {
        label: 'Catégorie',
        field: 'category_name',
        options: ['toutes', 'café en grain grand cru', 'café en grain biologique', 'café en grain décaféiné', 'café en grain italien', 'café en grain vert']
    },
    2: {
        label: 'Catégorie',
        field: 'category_name',
        options: ['toutes', 'café moulu grand cru', 'café moulu biologique', 'café moulu décaféiné', 'café moulu italien', 'chicorée']
    },
    3: {
        label: 'Catégorie',
        field: 'category_name',
        options: ['toutes', 'thé en vrac', 'thé vert', 'thé noir', 'thé rouge', 'thé en sachet']
    },
    4: {
        label: 'Catégorie',
        field: 'category_name',
        options: ['toutes', 'infusion en vrac', 'infusion aux herbes', 'infusion aux fleurs', 'infusion fruits et épices', 'infusion en sachet']
    },
    5: {
        label: 'Catégorie',
        field: 'category_name',
        options: ['toutes', 'machine à grain', 'machine à expresso', 'cafetière italienne', 'cafetière à piston', 'cafetière électrique']
    },
    6: {
        label: 'Catégorie',
        field: 'category_name',
        options: ['toutes', 'accessoires café', 'accessoires thé', 'moulin à café', 'bouilloire', 'théière']
    },
}

// 2e filtre (en dessous) : une caractéristique du produit
const FILTERS = {
    1: {
        label: 'Torréfaction',
        field: 'roast',
        options: ['toutes', 'moyenne', 'foncée', 'vert (non torréfié)']
    },
    2: { label: 'Mouture',
        field: 'grind_type',
        options: ['toutes', 'expresso', 'filtre', 'piston', 'italienne']
    },
    5: {
        label: 'Usage',
        field: 'usage',
        options: ['tous', 'extraction', 'mouture', 'précision', 'service']
    },
    6: {
        label: 'Technologie',
        field: 'technology',
        options: ['toutes', 'expresso', 'automatique', 'filtre', 'levier']
    },
}

const SKELETON_COUNT = 8 // cartes grises affichées pendant le chargement

const ProductPage = ({categoryId, title}) => {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedFilter, setSelectedFilter] = useState(0)
    const categoryConfig = FILTERED_CATEGORY[categoryId]
    const filterConfig = FILTERS[categoryId]

    // La catégorie choisie vit dans l'URL (?categorie=café en grain grand cru) :
    // le menu de la navbar et la barre de catégories restent ainsi synchronisés.
    const [searchParams, setSearchParams] = useSearchParams()
    const activeCategory = Math.max(0, categoryConfig?.options.indexOf(searchParams.get('categorie')) ?? 0)

    // Arrivée depuis le menu ou l'accueil avec ?categorie=... : on glisse en douceur jusqu'aux filtres
    // (et pas en haut de page). Uniquement à l'arrivée : un clic sur un filtre ne doit pas faire défiler la page.
    const filtersRef = useRef(null)
    const arrivedWithCategory = useRef(searchParams.has('categorie'))
    useEffect(() => {
        if (!arrivedWithCategory.current) return
        filtersRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'})
    }, [])

    const handleCategoryClick = (index) => {
        // index 0 = « toutes » : on retire le paramètre de l'URL
        setSearchParams(index === 0 ? {} : {categorie: categoryConfig.options[index]})
    }

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


    // Pas de return anticipé pendant le chargement : l'en-tête et les filtres s'affichent tout de suite,
    // seule la grille montre des cartes « squelettes », puis les vraies cartes apparaissent en fondu.

    // les deux filtres se cumulent : d'abord la catégorie, puis la caractéristique
    const inCategory = (!categoryConfig || activeCategory === 0)
        ? products
        : products.filter(
            (product) => product[categoryConfig.field]?.toLowerCase() === categoryConfig.options[activeCategory]
        )

    const visibleProducts = (!filterConfig || selectedFilter === 0)
        ? inCategory
        : inCategory.filter(
            (product) => product[filterConfig.field] === filterConfig.options[selectedFilter]
        )

    // une barre de filtre ; le compteur de produits n'apparaît que sur la dernière
    const renderFilterBar = (config, activeIndex, onSelect, showCount) => (
        <div className="product-filter">
            <span className="product-filter__label">{config.label}</span>
            {config.options.map((option, index) => (
                <button
                    key={option}
                    type="button"
                    className={`product-filter__button ${activeIndex === index ? 'product-filter__button--active' : ''}`}
                    onClick={() => onSelect(index)}>
                    {option}
                </button>
            ))}
            {showCount && !loading && <span className="product-filter__count">{visibleProducts.length} produit(s)</span>}
        </div>
    )

    return (
        <>
            <ProductHeader categoryId={categoryId}/>
            <div ref={filtersRef} className="product-filters">
                {categoryConfig && renderFilterBar(categoryConfig, activeCategory, handleCategoryClick, !filterConfig)}
                {filterConfig && renderFilterBar(filterConfig, selectedFilter, setSelectedFilter, true)}
            </div>
            <main className="product-page">
                <section className="product-grid" aria-busy={loading}>
                    {loading
                        ? Array.from({length: SKELETON_COUNT}, (_, i) => <div key={i} className="product-skeleton"/>)
                        : error
                            ? <p>{error}</p>
                            : visibleProducts.length > 0
                                ? visibleProducts.map((product) => (
                                    <ProductCard key={product.product_id} product={product}/>
                                ))
                                : <p>Aucun produit</p>}
                </section>
            </main>
            <ProductFooter categoryId={categoryId}/>
        </>
    );
};

export default ProductPage;
