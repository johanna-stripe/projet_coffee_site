//==================GET ORDER=====================
export const FIND_ALL_ORDERS = `
    SELECT o.order_id,
           o.order_number,
           o.order_date,
           o.order_status,
           o.order_total_price,
           c.customer_id,
           c.first_name,
           c.last_name,
           c.customer_email,
           c.phone
    FROM \`order\` o
             JOIN customer c ON c.customer_id = o.customer_id
    ORDER BY o.order_date DESC
`

export const FIND_ORDER_BY_CUSTOMER_ID = `
    SELECT c.customer_id,
           o.order_id,
           o.order_number,
           order_status
    FROM \`order\` o
             JOIN customer c ON c.customer_id = o.customer_id
    WHERE c.customer_id = ?
`

export const FIND_ORDER_DETAIL_BY_ORDER_ID = `
    SELECT *
    from \`order\` o
             JOIN customer c ON o.customer_id = c.customer_id
             JOIN customer_address ca ON o.shipping_address_id = ca.address_id
    WHERE o.order_id = ?
`

export const FIND_ORDER_ITEMS_BY_ORDER_ID = `
    SELECT oi.product_id,
           p.product_name,
           oi.quantity,
           oi.unit_price
    FROM order_item oi
             JOIN product p ON p.product_id = oi.product_id
    WHERE oi.order_id = ?
`

//==================POST ORDER=====================
export const CREATE_NEW_ORDER = `
    INSERT INTO \`order\` (customer_id, shipping_address_id, billing_address_id, order_number,
                           order_total_price, order_status, payment_method, shipping_cost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`

// Vérifie que les adresses demandées appartiennent bien au client
export const FIND_CUSTOMER_ADDRESSES_BY_IDS = `
    SELECT address_id
    FROM customer_address
    WHERE customer_id = ?
      AND address_id IN (?)
`

export const UPDATE_ORDER_NUMBER = `
    UPDATE \`order\`
    SET order_number = ?
    WHERE order_id = ?
`

export const CREATE_ORDER_ITEM = `
    INSERT INTO order_item (order_id, product_id, quantity, unit_price)
    VALUES (?, ?, ?, ?)
`

// "AND stock >= ?" : la vérification du stock et la décrémentation se font en UNE requête (pas de course entre deux clients)
export const DECREASE_PRODUCT_STOCK = `
    UPDATE product
    SET stock = stock - ?
    WHERE product_id = ?
      AND stock >= ?
`

// "FOR UPDATE" : verrouille la commande le temps de la transaction (deux annulations simultanées ne remettent pas le stock deux fois)
export const FIND_ORDER_STATUS_FOR_UPDATE = `
    SELECT order_status
    FROM \`order\`
    WHERE order_id = ?
    FOR UPDATE
`

export const FIND_ORDER_ITEMS_FOR_RESTOCK = `
    SELECT product_id, quantity
    FROM order_item
    WHERE order_id = ?
`

export const INCREASE_PRODUCT_STOCK = `
    UPDATE product
    SET stock = stock + ?
    WHERE product_id = ?
`

export const DELETE_CART_ITEMS_BY_CART_ID = `
    DELETE
    FROM cart_item
    WHERE cart_id = ?
`

//==================PATCH ORDER=====================
export const PATCH_ORDER = (fields) => {
    const setClause = fields.map(field => `${field}=?`).join(', ')
    return `
        UPDATE \`order\`
        SET ${setClause}
        WHERE order_id = ?
    `
}