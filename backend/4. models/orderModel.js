//==============IMPORTS==================
import db from '../6. config/database.js'

import {
    FIND_ORDER_BY_CUSTOMER_ID,
    FIND_ORDER_DETAIL_BY_ORDER_ID
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