//===========FIND USER BY EMAIL===============
export const FIND_USER_BY_EMAIL = `
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1
`

//===========CREATE USER===============
export const CREATE_USER = `
    INSERT INTO users (user_name, email, password, role)
    VALUES (?, ?, ?, ?)
`


//===========GET ALL USERS===============
export const FIND_ALL_USERS = `
    SELECT user_id, user_name, email, password, role, is_active, created_at
    FROM users
`

export const FIND_USER_BY_ID = `
    SELECT *
    FROM users
    WHERE user_id = ?
`

//===========UPDATE USER BY ID===============
export const UPDATE_USER_BY_ID = (fields) => {
    const setClause = fields.map(field => `${field} = ?`).join(', ')
    return `
        UPDATE users
        SET ${setClause}
        WHERE user_id = ?
    `
}
