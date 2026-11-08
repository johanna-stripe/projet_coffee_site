//==============IMPORTS==================
import db from '../config/database.js'

import {
    FIND_ALL_ORDERS,
    FIND_ORDER_BY_CUSTOMER_ID,
    FIND_ORDER_DETAIL_BY_ORDER_ID,
    CREATE_NEW_ORDER,
    PATCH_ORDER, FIND_ORDER_ITEMS_BY_ORDER_ID,
} from "../constantes/orderDBConstantes.js";


//==================GET ALL ORDERS=====================
export const findAllOrders = async () => {
    const [results] = await db.query(FIND_ALL_ORDERS)
    return results
}


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

//===================GET ORDER ITEMS==================================
export const findOrderItemsByOrderId = async (orderId) => {
    const [results] = await db.query(FIND_ORDER_ITEMS_BY_ORDER_ID, [orderId])
    return results
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


