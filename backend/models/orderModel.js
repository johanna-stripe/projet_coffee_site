//==============IMPORTS==================
import db from '../config/database.js'
import {randomUUID} from 'node:crypto'

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
    FIND_ORDER_STATUS_FOR_UPDATE,
    FIND_ORDER_ITEMS_FOR_RESTOCK,
    INCREASE_PRODUCT_STOCK,
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
// orderValues = [shipping_address_id, billing_address_id, order_total_price, order_status, payment_method, shipping_method, shipping_cost]
export const createOrderWithItems = async (customerId, cartId, orderValues, items) => {
    const [shippingAddressId, billingAddressId, totalPrice, status, paymentMethod, shippingMethod, shippingCost] = orderValues
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        // a. les adresses doivent appartenir au client
        const addressIds = [...new Set([shippingAddressId, billingAddressId])]
        const [addresses] = await connection.query(FIND_CUSTOMER_ADDRESSES_BY_IDS, [customerId, addressIds])
        if (addresses.length !== addressIds.length) throw errorBuilder('Address not valid', 400)

        // b. la commande, avec un numéro provisoire unique (16 caractères au hasard, remplacé juste après)
        const tempNumber = `TMP-${randomUUID().replaceAll('-', '').slice(0, 16)}`
        const [order] = await connection.query(CREATE_NEW_ORDER, [
            customerId, shippingAddressId, billingAddressId, tempNumber,
            totalPrice, status, paymentMethod, shippingMethod, shippingCost
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
// Transaction : si la commande passe à 'cancelled', le stock des articles est remis en même temps.
// values = [...valeurs des champs, orderId] ; newStatus = le nouveau order_status (ou undefined)
export const modifyByPatchOrder = async (fields, values, newStatus) => {
    const orderId = values[values.length - 1]
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()

        const [rows] = await connection.query(FIND_ORDER_STATUS_FOR_UPDATE, [orderId])
        if (rows.length === 0) {
            await connection.rollback()
            return {affectedRows: 0}
        }
        const oldStatus = rows[0].order_status

        // une commande annulée a déjà remis son stock : on ne la rouvre pas
        if (newStatus !== undefined && oldStatus === 'cancelled' && newStatus !== 'cancelled') {
            throw errorBuilder('A cancelled order cannot be changed', 400)
        }

        const [results] = await connection.query(PATCH_ORDER(fields), values)

        if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
            const [items] = await connection.query(FIND_ORDER_ITEMS_FOR_RESTOCK, [orderId])
            for (const item of items) {
                await connection.query(INCREASE_PRODUCT_STOCK, [item.quantity, item.product_id])
            }
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


