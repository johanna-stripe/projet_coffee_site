import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <article className="product-card">
            <div className="product-card__media">
                <img
                    className="product-card__image"
                    src={product.product_image_url}
                    alt={product.product_name}
                />
                <span className="product-card__badge">{product.category_name}</span>
                <button type="button" className="product-card__button">
                    Ajouter au panier
                </button>
            </div>

            <div className="product-card__body">
                <p className="product-card__brand">{product.brand_name}</p>
                <h2 className="product-card__name">{product.product_name}</h2>

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
