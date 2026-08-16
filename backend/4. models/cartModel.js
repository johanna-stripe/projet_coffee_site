import db from "../6. config/database.js"

import {
    //GET
    FIND_CART_BY_CUSTOMER_ID,
    //DELETE
    DELETE_CART,
} from "../5. constantes/cartDBConstantes.js";


//==================GET CART BY CUSTOMER ID=====================
export const findCartByCustomerId = async (customerId) => {
    const [results] = await db.query(FIND_CART_BY_CUSTOMER_ID, [customerId])
    return results[0] ?? null
}


//===================DELETE CART=======================
export const deleteCustomerCartById = async (cartId, customerId) => {
    const [results] = await db.query(DELETE_CART, [cartId, customerId])
    return results
}