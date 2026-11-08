//==============IMPORTS==================
import db from '../config/database.js'

import {
    FIND_ALL_ORDERS,
    FIND_ORDER_BY_CUSTOMER_ID,
    FIND_ORDER_DETAIL_BY_ORDER_ID,
    CREATE_NEW_ORDER,
    FIND_CUSTOMER_ADDRESSES_BY_IDS,
    UPDATE_ORDER_NUMBER,
    CREATE_ORDER_ITEM,
    DECREASE_PRODUCT_STOCK,
    DELETE_CART_ITEMS_BY_CART_ID,
    PATCH_ORDER, FIND_ORDER_ITEMS_BY_ORDER_ID,
} from "../constantes/orderDBConstantes.js";

import {errorBuilder} from "../private methods/privateMethods.js";


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

//==================POST ORDER + ARTICLES (transaction)=====================
// Tout passe ensemble ou rien : commande, numéro, articles, stock et vidage du panier.
// orderValues = [shipping_address_id, billing_address_id, order_total_price, order_status, payment_method, shipping_cost]
export const createOrderWithItems = async (customerId, cartId, orderValues, items) => {
    const [shippingAddressId, billingAddressId, totalPrice, status, paymentMethod, shippingCost] = orderValues
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        // a. les adresses doivent appartenir au client
        const addressIds = [...new Set([shippingAddressId, billingAddressId])]
        const [addresses] = await connection.query(FIND_CUSTOMER_ADDRESSES_BY_IDS, [customerId, addressIds])
        if (addresses.length !== addressIds.length) throw errorBuilder('Address not valid', 400)

        // b. la commande, avec un numéro provisoire (remplacé juste après)
        const [order] = await connection.query(CREATE_NEW_ORDER, [
            customerId, shippingAddressId, billingAddressId, 'TMP',
            totalPrice, status, paymentMethod, shippingCost
        ])
        const orderId = order.insertId

        // c. le vrai numéro : CMD-<année>-<order_id sur 4 chiffres>
        const orderNumber = `CMD-${new Date().getFullYear()}-${String(orderId).padStart(4, '0')}`
        await connection.query(UPDATE_ORDER_NUMBER, [orderNumber, orderId])

        // d. pour chaque article : stock puis ligne de commande
        for (const item of items) {
            const [stockUpdate] = await connection.query(DECREASE_PRODUCT_STOCK, [item.quantity, item.product_id, item.quantity])
            if (stockUpdate.affectedRows === 0) {
                throw errorBuilder(`Not enough stock for ${item.product_name}`, 400)
            }
            await connection.query(CREATE_ORDER_ITEM, [orderId, item.product_id, item.quantity, item.price])
        }

        // e. le panier est vidé
        await connection.query(DELETE_CART_ITEMS_BY_CART_ID, [cartId])

        await connection.commit()
        return {orderId, orderNumber}
    } catch (error) {
        await connection.rollback()
        throw error
    } finally {
        connection.release()
    }
}

//==================PATCH ORDER=====================
export const modifyByPatchOrder = async (fields, values) => {
    const query = PATCH_ORDER(fields)
    const [results] = await db.query(query, values)
    return results
}


