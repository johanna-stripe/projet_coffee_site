//==============IMPORTS==================
import {
    //GET
    findAllOrders,
    findOrderByCustomerId,
    findOrderDetailByOrderId,
    //POST
    createOrderWithItems,
    //PATCH
    modifyByPatchOrder, findOrderItemsByOrderId,
} from "../models/orderModel.js";

import {findCartByCustomerId, findProductsInCart} from "../models/cartModel.js";

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
        customer_email: row.customer_email,
        phone: row.phone,
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
    const order = await findOrderDetailByOrderId(orderId)
    if (!order) throw errorBuilder('Not found', 404)
    const items = await findOrderItemsByOrderId(orderId)
    return {
        order_id: order.order_id,
        customer_id: order.customer_id,
        shipping_address_id: order.shipping_address_id,
        billing_address_id: order.billing_address_id,
        order_number: order.order_number,
        order_date: order.order_date,
        order_status: order.order_status,
        payment_method: order.payment_method,
        shipping_cost: order.shipping_cost,
        items: items
    }
}

//==================POST ORDER=====================
const FREE_SHIPPING_THRESHOLD = 35   // livraison gratuite à partir de 35 € d'achats
const SHIPPING_FEE = 4.90

const roundPrice = (value) => Math.round(value * 100) / 100

// Le client n'envoie que les adresses et le moyen de paiement.
// Les articles, le total, les frais de port et le statut sont décidés par le serveur.
export const createNewOrder = async (customerId, orderData) => {
    const {shipping_address_id, billing_address_id, payment_method} = orderData
    if (!shipping_address_id || !billing_address_id || !payment_method) {
        throw errorBuilder('Shipping address, billing address and payment method are required', 400)
    }

    const cart = await findCartByCustomerId(customerId)
    if (!cart) throw errorBuilder('Cart is empty', 400)
    const items = await findProductsInCart(cart.cart_id)
    if (!items || items.length === 0) throw errorBuilder('Cart is empty', 400)

    const subtotal = roundPrice(items.reduce((sum, item) => sum + item.quantity * Number(item.price), 0))
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
    const totalPrice = roundPrice(subtotal + shippingCost)

    const orderValues = [
        shipping_address_id,
        billing_address_id,
        totalPrice,
        'pending',
        payment_method,
        shippingCost
    ]

    const {orderId, orderNumber} = await createOrderWithItems(customerId, cart.cart_id, orderValues, items)
    return {
        order_id: orderId,
        order_number: orderNumber,
        order_total_price: totalPrice,
        shipping_cost: shippingCost,
        order_status: 'pending'
    }
}

//==================PATCH ORDER=====================
export const modifyOrderByPatch = async (orderId, changes) => {
    const allowed_status = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
    const allowed_changes = ['customer_id', 'shipping_address_id', 'billing_address_id', 'order_date', 'order_total_price', 'order_status', 'payment_method', 'shipping_cost']
    const fields_to_update = []
    const values_to_update = []

    allowed_changes.forEach((field) => {
        if (changes[field] !== undefined) {
            fields_to_update.push(field);
            values_to_update.push(changes[field])
        }
    })
    if (fields_to_update.length === 0) throw errorBuilder('No field to update', 400)
    if (changes.order_status !== undefined && !allowed_status.includes(changes.order_status)) {
        throw errorBuilder('Order status not valid', 400)
    }

    values_to_update.push(orderId)

    return await modifyByPatchOrder(fields_to_update, values_to_update, changes.order_status)
}


