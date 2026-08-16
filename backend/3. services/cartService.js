//==============IMPORTS==================
import {
    //GET
    findCartByCustomerId,
    //DELETE
    deleteCustomerCartById,
} from "../4. models/cartModel.js";


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


//===================DELETE CART=======================
export const deleteByIdCustomerCart = async (cartId,customerId) => {
    const results = await deleteCustomerCartById(cartId,customerId)
    if (!results || results.affectedRows === 0) {
        return null
    }
    return results
}