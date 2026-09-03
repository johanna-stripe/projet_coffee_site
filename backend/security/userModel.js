import db from "../config/database.js"
import {
    FIND_USER_BY_EMAIL,
    CREATE_USER,
    FIND_ALL_USERS,
    FIND_USER_BY_ID,
    UPDATE_USER_BY_ID
} from "./userDBConstantes.js";


//===========FIND USER BY EMAIL===============
export const findUserByEmail = async (email) => {
    const [results] = await db.query(FIND_USER_BY_EMAIL, [email])
    return results [0]
}

//===========SAVE USER===============
export const saveUser = async ({username, email, password, role = "USER"}) => {
    const [results] = await db.query(CREATE_USER, [username, email, password, role])
    return {
        id: results.insertId,
        username,
        email,
        role
    }
}

//===========GET ALL USERS===============
export const findAllUsers = async () => {
    const [results] = await db.query(FIND_ALL_USERS)
    return results
}

//===========GET USER BY ID===============
export const getByIdUser = async (userId) => {
    const [results] = await db.query(FIND_USER_BY_ID, [userId])
    return results[0]
}


//===========POST USER===============
export const createUser = async (userValues) => {
    const [results] = await db.query(CREATE_USER, userValues)
    return results
}

//===========PATCH USER===============
export const updateUserById = async(fields, values)=>{
    const query = UPDATE_USER_BY_ID(fields)
    const [results]= await db.query(query,values)
    return results
}

export const updateUserRole = async (userId, role) => {
    const [results] = await db.query(UPDATE_ROLE, [role, userId])
    return results.affectedRows > 0;
    //s'assurer qu'il y a au moins une ligne qui a été touchée
}

export const deactivate = async (userId) => {
    const [results] = await db.query(UPDATE_IS_ACTIVE, [userId])
    return results.affectedRows > 0;
    //s'assurer qu'il y a au moins une ligne qui a été touchée
}
