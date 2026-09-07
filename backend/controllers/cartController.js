//==============IMPORTS==================
import {
    //GET
    getCartByCustomerId,
    //POST
    createNewCart,
    //PATCH
    modifyCartByPatch,
    //DELETE
    deleteByIdCustomerCart,
    deleteByIdCartItem,
} from "../services/cartService.js";


//==================GET CART BY CUSTOMER ID=====================
export const getCart = async (req, res) => {
    try {
        const customerId = req.params.customer_id

        if (!customerId) {
            return res.status(400).json({error: 'Customer Id is required'})
        }

        const results = await getCartByCustomerId(customerId)
        if (!results) {
            return res.status(404).json({error: 'Customer could not be found'})
        }

        return res.json({
            customerId,
            message: 'Customer found successfully',
            results
        })

    } catch (error) {
        console.log('You have a Server error')
       return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}

//===================POST CART=======================
export const createCart = async (req, res) => {
    try {
        const customerId = req.params.customer_id
        if (!customerId) {
            return res.status(400).json({error: 'Customer id is required'})
        }

        if (!req.body) {
            return res.status(400).json({error: 'Order details are required'})
        }

        const results = await createNewCart(customerId, req.body)
        if (!results || results.affectedRows === 0) {
            return res.status(404).json({error: 'Cart could not be created'})
        }
        return res.status(201).json({
            message: 'Cart created successfully',
            data: {
                id: results.insertId,
                ...req.body
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//===================PATCH CART=======================
export const patchOrderItem = async (req, res) => {
    try {
        const cartId = req.params.cart_id
        if (!cartId) {
            return res.status(400).json({error: 'Cart id is required'})
        }

        const productId = req.params.product_id
        if (!productId) {
            return res.status(400).json({error: 'Product id is required'})
        }

        if (!req.body) {
            return res.status(400).json({error: 'Product modification is required'})
        }

        const results = await modifyCartByPatch(cartId, productId, req.body)
        if (!results || results.affectedRows === 0) {
            return res.status(404).json({error: 'Cart could not be modified'})
        }
        return res.status(201).json({
            message: 'Cart modified successfully',
            data: {
                id: results.insertId,
                ...req.body
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}

//===================DELETE CART=======================
export const deleteCustomerCart = async (req, res) => {
    try {

        const cartId = req.params.cart_id
        if (!cartId) return res.status(400).json({error: 'Cart Id is required'})

        const customerId = req.params.customer_id
        if (!customerId) return res.status(400).json({error: 'Customer Id is required'})

        const results = await deleteByIdCustomerCart(cartId, customerId)
        if (!results) return res.status(404).json({error: 'Customer cart could not be found'})

        return res.json({
            cartId, customerId,
            message: 'Customer cart has been deleted',
            results
        })

    } catch (error) {
        console.log('You have a Server error')
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//===================DELETE ITEM FROM CART=======================
export const deleteItemFromCart = async (req, res) => {
    try {

        const cartId = req.params.cart_id
        if (!cartId) {
            return res.status(400).json({error: 'Cart Id is required'})
        }

        const productId = req.params.product_id
        if (!productId) {
            return res.status(400).json({error: 'Product Id is required'})
        }

        const results = await deleteByIdCartItem(cartId, productId)
        if (!results) {
            return res.status(404).json({error: 'Customer cart could not be found'})
        }
        return res.json({
            cartId, productId,
            message: 'Product has been deleted from cart',
            results
        })

    } catch
        (error) {
        console.log('You have a Server error')
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}