//==================GET CART BY CUSTOMER ID=====================
export const FIND_CART_BY_CUSTOMER_ID = `
    SELECT cart.cart_id,
           cart.cart_creation_date,
           c.customer_id

    FROM cart
             JOIN CUSTOMER c ON c.customer_id = cart.customer_id
    WHERE c.customer_id = ?
`

//===================POST CART=======================
export const CREATE_NEW_CART = `
    INSERT INTO cart(customer_id)
    VALUES (?)
`

export const CREATE_NEW_CART_ITEM = `
    INSERT INTO cart_item(cart_id, product_id, quantity)
    VALUES (?, ?, ?)
`


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