export const FIND_CUSTOMER_BY_ID = `SELECT *
                                    FROM customer
                                    WHERE customer_id = ?`


export const FIND_CUSTOMER_ADDRESSES_BY_ID = `
    SELECT ca.address_id,
           c.customer_id,
           ca.street,
           ca.city,
           ca.postcode,
           ca.country

    FROM customer_address ca
             JOIN customer c ON c.customer_id = ca.customer_id
    WHERE c.customer_id = ?
`


export const DELETE_CUSTOMER_BY_ID = `
    DELETE
    FROM customer
    WHERE customer_id = ?`


export const DELETE_CUSTOMER_ADDRESS_BY_ID = `
    DELETE
    FROM customer_address
    WHERE (customer_id, address_id) = (?, ?)
`