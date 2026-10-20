//==================GET CART BY CUSTOMER ID=====================
export const FIND_CART_BY_CUSTOMER_ID = `
    SELECT cart.cart_id,
           cart.cart_creation_date,
           c.customer_id

    FROM cart
             JOIN CUSTOMER c ON c.customer_id = cart.customer_id
    WHERE c.customer_id = ?
`


export const FIND_PRODUCTS_IN_CART = `
    SELECT ci.cart_id,
           ci.product_id,
           ci.quantity,
           p.product_name,
           p.price,
           p.product_image_url,
           p.stock
    FROM cart_item ci
             JOIN product p on p.product_id = ci.product_id
    WHERE ci.cart_id = ?
`


//===================POST CART=======================
export const CREATE_NEW_CART = `
    INSERT INTO cart(customer_id)
    VALUES (?)
`

export const CREATE_NEW_CART_ITEM = `
    INSERT INTO cart_item(cart_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
`
// - Produit pas encore dans le panier : l'INSERT s'exécute normalement.
// - Produit déjà là : la quantité existante (quantity) est augmentée de la nouvelle (VALUES(quantity), la valeur que tu essayais d'insérer). Avec 2 en panier et 3 ajoutés, tu obtiens 5.


//===================PATCH CART=======================
export const PATCH_CART = (fields) => {
    const setClause = fields.map(field => `${field}=?`).join(', ')
    return `
        UPDATE cart_item
        SET ${setClause}
        WHERE (cart_id, product_id) = (?, ?)
    `
}


//===================DELETE CART=======================
export const DELETE_CART = `
    DELETE
    FROM cart
    WHERE (cart_id, customer_id) = (?, ?)
`

export const DELETE_CART_ITEM = `
    DELETE
    FROM cart_item
    WHERE (cart_id, product_id) = (?, ?)
`