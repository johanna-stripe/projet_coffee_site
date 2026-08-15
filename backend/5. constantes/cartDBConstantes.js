export const FIND_CART_BY_CUSTOMER_ID = `
    SELECT cart.cart_id,
           cart.cart_creation_date,
           c.customer_id

    FROM cart
             JOIN CUSTOMER c ON c.customer_id = cart.customer_id
    WHERE c.customer_id = ?
`