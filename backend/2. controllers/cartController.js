//==============IMPORTS==================
import {
    //GET
    getCartByCustomerId,
    //DELETE
    deleteByIdCustomerCart,
} from "../3. services/cartService.js";


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
        return res.status(500).json({message: 'Internal server error'})
    }
}


//===================DELETE CART=======================
export const deleteCustomerCart = async (req, res) => {
    try {

        const customerCart = req.params.cart_id
        if (!customerCart) {
            return res.status(400).json({error: 'Cart Id is required'})
        }

        const customerId = req.params.customer_id
        if (!customerId) {
            return res.status(400).json({error: 'Customer Id is required'})
        }

        const results = await deleteByIdCustomerCart(customerCart, customerId)
        if (!results) {
            return res.status(404).json({error: 'Customer cart could not be found'})
        }
        return res.json({
            customerCart, customerId,
            message: 'Customer cart has been deleted',
            results
        })

    } catch
        (error) {
        console.log('You have a Server error')
        return res.status(500).json({message: 'Internal server error'})
    }
}