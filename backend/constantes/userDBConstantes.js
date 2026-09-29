//===========FIND USER BY EMAIL===============
export const FIND_USER_BY_EMAIL = `
    SELECT *
    FROM users
    WHERE user_email = ?
    LIMIT 1
`

//===========GET ALL USERS===============
export const FIND_ALL_USERS = `
    SELECT user_id AS id, first_name, last_name, user_email AS email, phone, birth_date, password, role, is_active, created_at
    FROM users
`

export const FIND_USER_BY_ID = `
    SELECT *
    FROM users
    WHERE user_id = ?
    LIMIT 1
`

//===========CREATE USER===============
export const CREATE_USER = `
    INSERT INTO users (first_name, last_name, user_email, phone, birth_date, password)
    VALUES (?, ?, ?, ?, ?, ?)
`


//===========UPDATE USER BY ID===============
export const UPDATE_USER_BY_ID = (fields) => {
    const columnMapping = {
        email: 'user_email', // Traduit 'email' en 'user_email'
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

