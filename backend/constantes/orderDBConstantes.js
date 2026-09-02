//==================GET ORDER=====================
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

//==================POST ORDER=====================
export const CREATE_NEW_ORDER = `
    INSERT INTO \`order\` (customer_id, shipping_address_id, billing_address_id, order_number, 
                           order_total_price, order_status, payment_method, shipping_cost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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