//==============IMPORTS==================
import {
    //GET
    findAllOrders,
    findOrderByCustomerId,
    findOrderDetailByOrderId,
    //POST
    createANewOrder,
    //PATCH
    modifyByPatchOrder,
} from "../models/orderModel.js";

import {
    normalizeText,
    errorBuilder
} from "../private methods/privateMethods.js";

//==================GET ALL ORDERS=====================
export const getAllOrdersList = async () => {
    const rows = await findAllOrders()
    // pas d'erreur 404 si vide : pour l'admin, "aucune commande" est une liste vide
    return rows.map(row => ({
        order_id: row.order_id,
        order_number: row.order_number,
        order_date: row.order_date,
        order_status: row.order_status,
        order_total_price: row.order_total_price,
        customer_id: row.customer_id,
        first_name: row.first_name,
        last_name: row.last_name,
    }))
}


//==================GET CUSTOMER ORDER BY CUSTOMER ID=====================
export const getOrderByCustomerId = async (customerId) => {
    const rows = await findOrderByCustomerId(customerId)
    if (!rows || rows.length === 0) throw errorBuilder('Not found', 404)
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
    if (!rows || rows.length === 0) throw errorBuilder('Not found', 404)
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

//==================POST ORDER=====================
export const createNewOrder = async (customerId, orderData) => {
    const {
        shipping_address_id,
        billing_address_id,
        order_number,
        order_total_price,
        order_status,
        payment_method,
        shipping_cost
    } = orderData

    const values = [
        shipping_address_id,
        billing_address_id,
        order_number,
        order_total_price,
        order_status,
        payment_method,
        shipping_cost
    ]

    return await createANewOrder(customerId, values)
}

//==================PATCH ORDER=====================
export const modifyOrderByPatch = async (orderId, changes) => {
    const allowed_status = ['paid', 'pending', 'cancelled']
    const allowed_changes = ['customer_id', 'shipping_address_id', 'billing_address_id', 'order_number', 'order_date', 'order_total_price', 'order_status', 'payment_method', 'shipping_cost']
    const fields_to_update = []
    const values_to_update = []

    allowed_changes.forEach((field) => {
        if (changes[field] !== undefined) {
            fields_to_update.push(field);
            values_to_update.push(changes[field])
        }
    })
    if (fields_to_update.length === 0) throw errorBuilder('No field to update', 400)

    values_to_update.push(orderId)

    return await modifyByPatchOrder(fields_to_update, values_to_update)
}


