//==============IMPORTS==================
import db from "../6. config/database.js"

import {
    //GET
    FIND_CUSTOMER_BY_ID,
    FIND_CUSTOMER_ADDRESSES_BY_ID,
    //DELETE
    DELETE_CUSTOMER_BY_ID,
    DELETE_CUSTOMER_ADDRESS_BY_ID,
} from "../5. constantes/customerDBConstantes.js";

//==================GET CUSTOMER BY ID=====================
export const findCustomerById = async (customerId)=>{
    const [results] = await db.query(FIND_CUSTOMER_BY_ID, [customerId])
    return results[0] ?? null
}


//==================GET CUSTOMER ADDRESSES=====================
export const findCustomerAddressesById = async (customerId)=> {
    const [results] = await db.query(FIND_CUSTOMER_ADDRESSES_BY_ID, [customerId])
    return results
}


//==================DELETE CUSTOMER=====================
export const deleteCustomerById = async(customerId)=>{
    const [results] = await db.query(DELETE_CUSTOMER_BY_ID,[customerId])
    return results
}

//==================DELETE CUSTOMER ADDRESS=====================
export const deleteCustomerAddressById = async(customerId,customerAddress)=>{
    const [results] = await db.query(DELETE_CUSTOMER_ADDRESS_BY_ID,[customerId,customerAddress])
    return results
}