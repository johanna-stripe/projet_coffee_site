import {errorBuilder} from "../../private methods/privateMethods.js";
import {findCartByCustomerId} from "../../models/cartModel.js";

export const checkCustomerOwner = (req, res, next) => {
    if (req.user.customer_id !== Number(req.params.customer_id)) throw errorBuilder('Access denied', 403)
    next()
};

export const checkCartOwner = async (req, res, next) => {
    const customerCart = await findCartByCustomerId(req.user.customer_id)
    if (!customerCart || (customerCart.cart_id !== Number(req.params.cart_id))) throw errorBuilder('Access Denied', 403)
    next()
};