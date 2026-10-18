//==============IMPORTS==================
import db from "../config/database.js"

import {
    //GET
    FIND_CUSTOMER_BY_ID,
    FIND_CUSTOMER_BY_USER_ID,
    FIND_CUSTOMER_BY_EMAIL,
    FIND_CUSTOMER_ADDRESSES_BY_ID,
    //POST
    CREATE_NEW_CUSTOMER,
    CREATE_NEW_CUSTOMER_ADDRESS,
    //PATCH
    PATCH_CUSTOMER,
    PATCH_CUSTOMER_BY_USER_ID,
    PATCH_CUSTOMER_ADDRESS,
    //DELETE
    DELETE_CUSTOMER_BY_ID,
    DELETE_CUSTOMER_ADDRESS_BY_ID,
    //ADRESSE PAR DÉFAUT
    UNSET_DEFAULT_ADDRESSES,
    SET_DEFAULT_ADDRESS,
} from "../constantes/customerDBConstantes.js";

//==================GET CUSTOMER BY ID=====================
export const findCustomerById = async (customerId) => {
    const [results] = await db.query(FIND_CUSTOMER_BY_ID, [customerId])
    return results[0] ?? null
}

//==================GET CUSTOMER BY USER_ID=====================
export const findCustomerByUserId = async (userId) => {
    const [results] = await db.query(FIND_CUSTOMER_BY_USER_ID, [userId])
    return results[0] ?? null
}

//==================GET CUSTOMER BY EMAIL=====================
export const findCustomerByEmail = async (email) => {
    const [results] = await db.query(FIND_CUSTOMER_BY_EMAIL, [email])
    return results[0] ?? null
}


//==================GET CUSTOMER ADDRESSES=====================
export const findCustomerAddressesById = async (customerId) => {
    const [results] = await db.query(FIND_CUSTOMER_ADDRESSES_BY_ID, [customerId])
    return results
}


//==================POST CUSTOMER=====================
// values = [user_id, first_name, last_name, customer_email, phone, birth_date]
export const createANewCustomer = async (values) => {
    const [results] = await db.query(CREATE_NEW_CUSTOMER, values)
    return results
}

//==================POST CUSTOMER ADDRESS=====================
export const createANewCustomerAddress = async (customerId, values) => {
    const [results] = await db.query(CREATE_NEW_CUSTOMER_ADDRESS, [customerId, ...values])
    return results
}

//==================PATCH CUSTOMER=====================
export const modifyByPatchCustomer = async (fields, values) => {
    const query = PATCH_CUSTOMER(fields)
    const [results] = await db.query(query, values)
    return results
}

//==================PATCH CUSTOMER BY USER ID=====================
export const modifyCustomerByUserId = async (fields, values) => {
    const query = PATCH_CUSTOMER_BY_USER_ID(fields)
    const [results] = await db.query(query, values)
    return results
}

//==================PATCH CUSTOMER ADDRESS=====================
export const modifyByPatchCustomerAddress = async (fields, values) => {
    const query = PATCH_CUSTOMER_ADDRESS(fields)
    const [results] = await db.query(query, values)
    return results
}


//==================DELETE CUSTOMER=====================
export const deleteCustomerById = async (customerId) => {
    const [results] = await db.query(DELETE_CUSTOMER_BY_ID, [customerId])
    return results
}

//==================DELETE CUSTOMER ADDRESS=====================

export const deleteCustomerAddressById = async (customerId, customerAddress) => {
    const [results] = await db.query(DELETE_CUSTOMER_ADDRESS_BY_ID, [customerId, customerAddress])
    return results
}


//==================ADRESSE PAR DÉFAUT=====================
// Transaction : les 2 requêtes passent ensemble ou pas du tout,
// pour qu'un client ait toujours UNE SEULE adresse par défaut.
export const setDefaultCustomerAddress = async (customerId, addressId) => {
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()
        await connection.query(UNSET_DEFAULT_ADDRESSES, [customerId])
        const [results] = await connection.query(SET_DEFAULT_ADDRESS, [customerId, addressId])

        if (results.affectedRows === 0) {
            // l'adresse n'existe pas ou n'appartient pas à ce client -> on annule tout
            await connection.rollback()
            return results
        }

        await connection.commit()
        return results
    } catch (error) {
        await connection.rollback()
        throw error
    } finally {
        connection.release()
    }
}
