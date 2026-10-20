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
    deleteCartItemById, findProductsInCart,
} from "../models/cartModel.js";

import {
    normalizeText,
    errorBuilder
} from "../private methods/privateMethods.js";
import req from "express/lib/request.js";

//==================GET CART BY CUSTOMER ID=====================
export const getCartByCustomerId = async (customerId) => {
    const cart = await findCartByCustomerId(customerId)
    if (!cart) throw errorBuilder('Not found', 404)

    const products = await findProductsInCart(cart.cart_id)

    return {
        cart_id: cart.cart_id,
        cart_creation_date: cart.cart_creation_date,
        customer_id: cart.customer_id,
        items: products
    }
}

export const getProductsbyCartId = async (cartId) => {
    const products = await findProductsInCart(cartId)
    if (!products || products.length === 0) throw errorBuilder('Not found', 404)
    return products
}

//===================POST CART=======================
export const addNewItemToCart = async (customerId, cartData) => {
    const {product_id, quantity} = cartData
    const cartItemValues = [product_id, quantity]


    // Verification si le customer a déjà un panier
    const existingCart = await findCartByCustomerId(customerId)
    // Si pas de panier :
    if (!existingCart) {
        const newCart = await createANewCart(customerId)
        return await createANewOrderItem(newCart.insertId, cartItemValues)

        // Si panier existe déjà :
    }
    return  await createANewOrderItem(existingCart.cart_id, cartItemValues)
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
    if (!results || results.affectedRows === 0) throw errorBuilder('Not found', 404)
    return results
}

export const deleteByIdCartItem = async (cartId, productId) => {
    const results = await deleteCartItemById(cartId, productId)
    if (!results || results.affectedRows === 0) throw errorBuilder('Not found', 404)
    return results
}

