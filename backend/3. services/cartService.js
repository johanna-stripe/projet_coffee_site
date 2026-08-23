//==============IMPORTS==================
import {
    //GET
    findCartByCustomerId,
    //POST
    createANewCart,
    createANewOrderItem,
    //PATCH
    modifyByPatchCart,
    //DELETE
    deleteCustomerCartById,
    deleteCartItemById,
} from "../4. models/cartModel.js";

import {
    normalizeText,
    errorBuilder
} from "../7. private methods/privateMethods.js";


//==================GET CART BY CUSTOMER ID=====================
export const getCartByCustomerId = async (customerId) => {
    const rows = await findCartByCustomerId(customerId)

    if (!rows) {
        return null
    }
    return {
        cart_id: rows.cart_id,
        cart_creation_date: rows.cart_creation_date,
        customer_id: rows.customer_id,
    }
}


//===================POST CART=======================
export const createNewCart = async (customerId, cartData) => {
    const {
        product_id,
        quantity
    } = cartData

    const cartItemValues = [
        product_id,
        quantity
    ]

    const newCart = await createANewCart(customerId)
    const newCartId = newCart.insertId

    return await createANewOrderItem(newCartId, cartItemValues)
}


//===================PATCH CART=======================
export const modifyCartByPatch = async (cartId, productId, changes) => {
    const allowed_updates = ['quantity']
    const fields_to_update = []
    const values_to_update = []

    allowed_updates.forEach((field) => {
        if (changes[field] !== undefined) {
            fields_to_update.push(field)
            values_to_update.push(changes[field])
        }
    })

    if (fields_to_update.length === 0) throw errorBuilder('No field to update', 400)

    values_to_update.push(cartId, productId)

    return await modifyByPatchCart(fields_to_update, values_to_update)

}


//===================DELETE CART=======================
export const deleteByIdCustomerCart = async (cartId, customerId) => {
    const results = await deleteCustomerCartById(cartId, customerId)
    if (!results || results.affectedRows === 0) {
        return null
    }
    return results
}

export const deleteByIdCartItem = async (cartId, productId) => {
    const results = await deleteCartItemById(cartId, productId)
    if (!results || results.affectedRows === 0) {
        return null
    }
    return results
}


//===================DELETE CART=======================
export const deleteByIdCustomerCart = async (cartId, customerId) => {
    const results = await deleteCustomerCartById(cartId, customerId)
    if (!results || results.affectedRows === 0) {
        return null
    }
    return results
}