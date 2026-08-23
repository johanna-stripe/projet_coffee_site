import db from "../6. config/database.js"

import {
    //GET
    FIND_CART_BY_CUSTOMER_ID,
    //POST
    CREATE_NEW_CART,
    CREATE_NEW_CART_ITEM,
    //PATCH
    PATCH_CART,
    //DELETE
    DELETE_CART,
    DELETE_CART_ITEM,
} from "../5. constantes/cartDBConstantes.js";


//==================GET CART BY CUSTOMER ID=====================
export const findCartByCustomerId = async (customerId) => {
    const [results] = await db.query(FIND_CART_BY_CUSTOMER_ID, [customerId])
    return results[0] ?? null
}

//===================POST CART=======================
export const createANewCart = async (customerId) => {
    const [results] = await db.query(CREATE_NEW_CART, customerId)
    return results
}

export const createANewOrderItem = async (cartId, values) => {
    const [results] = await db.query(CREATE_NEW_CART_ITEM, [cartId, ...values])
    return results
}


//===================PATCH CART=======================
export const modifyByPatchCart = async (fields, values) => {
    const query = PATCH_CART(fields)
    const [results] = await db.query(query, values)
    return results
}


//===================DELETE CART=======================
export const deleteCustomerCartById = async (cartId, customerId) => {
    const [results] = await db.query(DELETE_CART, [cartId, customerId])
    return results
}

export const deleteCartItemById = async (cartId, productId) => {
    const [results] = await db.query(DELETE_CART_ITEM, [cartId, productId])
    return results
}