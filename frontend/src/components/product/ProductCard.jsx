import React from 'react';
import {Link} from "react-router-dom";
import {productPath} from "../../routes/paths.js";

const ProductCard = ({product}) => {
    return (
        <article className="product-card">
            <div className="product-card__media">
                <Link to={productPath(product.product_id)} className="product-card__link">
                    <img
                        className="product-card__image"
                        src={product.product_image_url}
                        alt={product.product_name}
                    />
                </Link>
                <span className="product-card__badge">{product.category_name}</span>
                <button type="button" className="product-card__button">
                    Ajouter au panier
                </button>
            </div>

            <div className="product-card__body">
                <div className="flex gap-20px">
                    {product.origin && (
                        <div className="flex flex-direction-column align-items-center">
                            <p className="m-bottom-5px m-0 font-bold">Origine</p>
                            <p className="product-card__origin">{product.origin}</p>
                        </div>
                    )}
                    {product.roast && (
                        <div className="flex flex-direction-column align-items-center">
                            <p className="m-bottom-5px m-0 font-bold">Torréfaction</p>
                            <p className="product-card__roast">{product.roast}</p>
                        </div>
                    )}
                </div>
                <p className="product-card__brand">{product.brand_name}</p>
                <h2 className="product-card__name">
                    <Link to={productPath(product.product_id)} className="product-card__link">
                        {product.product_name}
                    </Link>
                </h2>
                <p className="product-card__description">{product.product_description}</p>

                <div className="product-card__footer">
                    <p className="product-card__price">{product.price} €</p>
                    {product.weight && (
                        <p className="product-card__weight">{Number(product.weight)} g</p>
                    )}
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
