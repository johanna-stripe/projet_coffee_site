//==================GET CUSTOMER=====================
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

//==================POST CUSTOMER=====================
export const CREATE_NEW_CUSTOMER = `
    INSERT INTO customer (password_hash, first_name, last_name, email_address, phone_number)
    VALUES (?, ?, ?, ?, ?)
`

//==================POST CUSTOMER ADDRESS=====================
export const CREATE_NEW_CUSTOMER_ADDRESS =`
    INSERT INTO customer_address (customer_id, street, city, postcode, country)
    VALUES (?, ?, ?, ?, ?)
`


//==================PATCH CUSTOMER=====================
export const PATCH_CUSTOMER = (fields) => {
    const setClause = fields.map(field => `${field}=?`).join(', ')
    return `
        UPDATE customer
        SET ${setClause}
        WHERE customer_id = ?
    `
}

//==================PATCH CUSTOMER ADDRESS=====================
export const PATCH_CUSTOMER_ADDRESS = (fields) => {
    const setClause = fields.map(field => `${field}=?`).join(', ')
    return `
        UPDATE customer_address
        SET ${setClause}
        WHERE address_id = ?
    `
}


//==================DELETE CUSTOMER=====================
export const DELETE_CUSTOMER_BY_ID = `
    DELETE
    FROM customer
    WHERE customer_id = ?`


export const DELETE_CUSTOMER_ADDRESS_BY_ID = `
    DELETE
    FROM customer_address
    WHERE (customer_id, address_id) = (?, ?)
`