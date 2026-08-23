//==============IMPORTS==================
import db from '../6. config/database.js'

import {
    //GET
    FIND_ORDER_BY_CUSTOMER_ID,
    FIND_ORDER_DETAIL_BY_ORDER_ID,
    //POST
    CREATE_NEW_ORDER,
    //PATCH
    PATCH_ORDER,
} from "../5. constantes/orderDBConstantes.js";


//==================GET CUSTOMER ORDER BY CUSTOMER ID=====================
export const findOrderByCustomerId = async (customerId) => {
    const [results] = await db.query(FIND_ORDER_BY_CUSTOMER_ID, [customerId])
    return results
}


//==================GET ORDER DETAIL BY ORDER ID=====================
export const findOrderDetailByOrderId = async (orderId) => {
    const [results] = await db.query(FIND_ORDER_DETAIL_BY_ORDER_ID, [orderId])
    return results[0] ?? null
}


//==================POST ORDER=====================
export const createANewOrder = async(customerId, values)=>{
    const [results] = await db.query(CREATE_NEW_ORDER,[customerId, ...values])
    return results
}

//==================PATCH ORDER=====================
export const modifyByPatchOrder = async (fields, values) => {
    const query = PATCH_ORDER(fields)
    const [results] = await db.query(query, values)
    return results
}


