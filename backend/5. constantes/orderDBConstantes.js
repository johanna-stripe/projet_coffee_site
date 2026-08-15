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