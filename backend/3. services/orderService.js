//==============IMPORTS==================
import {
    //GET
    findOrderByCustomerId,
    findOrderDetailByOrderId,
} from "../4. models/orderModel.js";

//==================GET CUSTOMER ORDER BY CUSTOMER ID=====================
export const getOrderByCustomerId = async (customerId) => {
    const rows = await findOrderByCustomerId(customerId)
    if (rows.length === 0) {
        return null
    }
    return rows.map(row => ({
//map : rows est le tableau de [results] donc si un client a plusieurs commandes, il faut transformer chaque ligne du tableau en un nouvel objet
        customer_id: row.customer_id,
        order_id: row.order_id,
        order_number: row.order_number,
        order_status: row.order_status,
    }))
}


//==================GET ORDER DETAIL BY ORDER ID=====================
export const getOrderDetailByOrderId = async (orderId) => {
    const rows = await findOrderDetailByOrderId(orderId)
    if (rows.length === 0) {
        return null
    }
    return {
        order_id: rows[0].order_id,
        customer_id: rows[0].customer_id,
        shipping_address_id: rows[0].shipping_address_id,
        billing_address_id: rows[0].billing_address_id,
        order_number: rows[0].order_number,
        order_date: rows[0].order_date,
        order_status: rows[0].order_status,
        payment_method: rows[0].payment_method,
        shipping_cost: rows[0].shipping_cost
    }
}


