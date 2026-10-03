// Table users = le COMPTE (username, email de connexion, mot de passe, rôle).
// Les infos personnelles (prénom, nom, téléphone, date de naissance) sont dans customer.
// On fait un LEFT JOIN pour récupérer les deux d'un coup quand on en a besoin.

const USER_WITH_CUSTOMER = `
    SELECT u.user_id, u.username, u.email, u.password, u.role, u.is_active, u.created_at, u.updated_at,
           c.customer_id, c.first_name, c.last_name, c.customer_email, c.phone, c.birth_date
    FROM users u
    LEFT JOIN customer c ON c.user_id = u.user_id
`

//===========FIND USER BY EMAIL===============
export const FIND_USER_BY_EMAIL = `
    ${USER_WITH_CUSTOMER}
    WHERE u.email = ?
    LIMIT 1
`

//===========GET ALL USERS===============
// (on n'expose plus le mot de passe hashé dans la liste)
export const FIND_ALL_USERS = `
    SELECT u.user_id AS id, u.username, u.email, u.role, u.is_active, u.created_at,
           c.customer_id, c.first_name, c.last_name, c.phone, c.birth_date
    FROM users u
    LEFT JOIN customer c ON c.user_id = u.user_id
`

//===========FIND USER BY ID===============
export const FIND_USER_BY_ID = `
    ${USER_WITH_CUSTOMER}
    WHERE u.user_id = ?
    LIMIT 1
`

//===========CREATE USER===============
export const CREATE_USER = `
    INSERT INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
`


//===========UPDATE USER BY ID===============
export const UPDATE_USER_BY_ID = (fields) => {
    const columnMapping = {
        new_password: 'password'
    };
    const setClause = fields
        .map(field => `${columnMapping[field] || field} = ?`)
        .join(', ')
    return `
        UPDATE users
        SET ${setClause}
        WHERE user_id = ?
    `
}

//===========UPDATE USER ROLE===============
export const UPDATE_ROLE = `
    UPDATE users
    SET role = ?
    WHERE user_id = ?
`

//===========ACTIVATE USER===============
export const UPDATE_ACTIVATE_USER = `
    UPDATE users
    SET is_active = TRUE
    WHERE user_id = ?
`

//===========DEACTIVATE USER===============
export const UPDATE_DEACTIVATE_USER = `
    UPDATE users
    SET is_active = FALSE
    WHERE user_id = ?
`
