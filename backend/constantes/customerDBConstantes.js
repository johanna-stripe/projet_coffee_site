// Table customer = les infos PERSONNELLES / de contact.
// user_id peut être NULL (client invité sans compte).

//==================GET CUSTOMER=====================
export const FIND_CUSTOMER_BY_ID = `
    SELECT customer_id, user_id, first_name, last_name, customer_email, phone, birth_date
    FROM customer
    WHERE customer_id = ?
`

export const FIND_CUSTOMER_BY_USER_ID = `
    SELECT customer_id, user_id, first_name, last_name, customer_email, phone, birth_date
    FROM customer
    WHERE user_id = ?
    LIMIT 1
`

export const FIND_CUSTOMER_BY_EMAIL = `
    SELECT customer_id, user_id, first_name, last_name, customer_email, phone, birth_date
    FROM customer
    WHERE customer_email = ?
    LIMIT 1
`

export const FIND_CUSTOMER_ADDRESSES_BY_ID = `
    SELECT address_id, customer_id, address_name, is_default, street, city, postcode, country
    FROM customer_address
    WHERE customer_id = ?
    ORDER BY is_default DESC, address_id
`

//==================POST CUSTOMER=====================
export const CREATE_NEW_CUSTOMER = `
    INSERT INTO customer (user_id, first_name, last_name, customer_email, phone, birth_date)
    VALUES (?, ?, ?, ?, ?, ?)
`

//==================POST CUSTOMER ADDRESS=====================
export const CREATE_NEW_CUSTOMER_ADDRESS =`
    INSERT INTO customer_address (customer_id, address_name, is_default, street, city, postcode, country)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`

//==================ADRESSE PAR DÉFAUT=====================
// 1) on enlève le "par défaut" de toutes les adresses du client
export const UNSET_DEFAULT_ADDRESSES = `
    UPDATE customer_address
    SET is_default = 0
    WHERE customer_id = ?
`

// 2) on le met sur l'adresse choisie
export const SET_DEFAULT_ADDRESS = `
    UPDATE customer_address
    SET is_default = 1
    WHERE customer_id = ? AND address_id = ?
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

//==================PATCH CUSTOMER BY USER ID=====================
export const PATCH_CUSTOMER_BY_USER_ID = (fields) => {
    const setClause = fields.map(field => `${field}=?`).join(', ')
    return `
        UPDATE customer
        SET ${setClause}
        WHERE user_id = ?
    `
}

//==================LINK GUEST CUSTOMER TO USER=====================
// Un client invité (user_id NULL) qui crée un compte : on rattache sa fiche existante
export const LINK_CUSTOMER_TO_USER = `
    UPDATE customer
    SET user_id = ?, first_name = ?, last_name = ?, phone = ?, birth_date = ?
    WHERE customer_id = ? AND user_id IS NULL
`

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
