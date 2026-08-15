//==============IMPORTS==================
import {
    findCartByCustomerId
} from "../4. models/cartModel.js";


//==================GET CART BY CUSTOMER ID=====================
export const getCartByCustomerId = async (customerId) => {
    const rows = await findCartByCustomerId (customerId)

    if (!rows) {
        return null
    }
    return {
        cart_id:rows.cart_id,
        cart_creation_date:rows.cart_creation_date,
        customer_id:rows.customer_id,
    }
}