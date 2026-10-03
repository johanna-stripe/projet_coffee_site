import db from "../config/database.js"
import {
    FIND_USER_BY_EMAIL,
    CREATE_USER,
    FIND_ALL_USERS,
    FIND_USER_BY_ID,
    UPDATE_USER_BY_ID,
    UPDATE_ROLE,
    UPDATE_ACTIVATE_USER,
    UPDATE_DEACTIVATE_USER,
} from "../constantes/userDBConstantes.js";
import {
    CREATE_NEW_CUSTOMER,
    FIND_CUSTOMER_BY_EMAIL,
    LINK_CUSTOMER_TO_USER,
} from "../constantes/customerDBConstantes.js";
import {errorBuilder} from "../private methods/privateMethods.js";


//===========FIND USER BY EMAIL===============
// renvoie le user + ses infos customer (first_name, last_name, phone, birth_date...)
export const findUserByEmail = async (email) => {
    const [results] = await db.query(FIND_USER_BY_EMAIL, [email])
    return results[0]
}

//===========SAVE USER + CUSTOMER (transaction)===============
// Crée le compte (users) ET la fiche perso (customer) en une seule fois :
// si l'un des deux échoue, rien n'est enregistré (ROLLBACK).
export const saveUserWithCustomer = async ({username, email, password, role = "USER"}, customer) => {
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        const [userResult] = await connection.query(CREATE_USER, [username, email, password, role])
        const user_id = userResult.insertId

        let customer_id = null
        if (customer) {
            const {first_name, last_name, customer_email, phone, birth_date} = customer

            // Un client invité avec le même email existe déjà ? -> on le rattache au nouveau compte
            const [existing] = await connection.query(FIND_CUSTOMER_BY_EMAIL, [customer_email])
            if (existing[0]) {
                if (existing[0].user_id) throw errorBuilder('This contact email is already linked to an account', 409)
                await connection.query(LINK_CUSTOMER_TO_USER,
                    [user_id, first_name, last_name, phone || null, birth_date || null, existing[0].customer_id])
                customer_id = existing[0].customer_id
            } else {
                const [customerResult] = await connection.query(CREATE_NEW_CUSTOMER,
                    [user_id, first_name, last_name, customer_email, phone || null, birth_date || null])
                customer_id = customerResult.insertId
            }
        }

        await connection.commit()

        return {
            user_id,
            customer_id,
            username,
            email,
            role,
            first_name: customer?.first_name ?? null,
            last_name: customer?.last_name ?? null,
            phone: customer?.phone || null,
            birth_date: customer?.birth_date || null,
        }
    } catch (error) {
        await connection.rollback()
        throw error
    } finally {
        connection.release()
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

export const activate = async (userId) => {
    const [results] = await db.query(UPDATE_ACTIVATE_USER, [userId])
    return results.affectedRows > 0;
    //s'assurer qu'il y a au moins une ligne qui a été touchée
}

export const deactivate = async (userId) => {
    const [results] = await db.query(UPDATE_DEACTIVATE_USER, [userId])
    return results.affectedRows > 0;
    //s'assurer qu'il y a au moins une ligne qui a été touchée
}
