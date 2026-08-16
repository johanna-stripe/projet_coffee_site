//==============IMPORTS==================
import {
    getOrderByCustomerId,
    getOrderDetailByOrderId
} from "../3. services/orderService.js";


//==================GET CUSTOMER ORDER BY CUSTOMER ID=====================
export const getOrderByCustomer = async (req, res) => {
    try {
        const customerId = req.params.customer_id
        if (!customerId) {
            return res.status(400).json({error: 'Customer id is required'})
        }
        const results = await getOrderByCustomerId(customerId)
        if (!results) {
            return res.status(404).json({error: 'Customer could not be found'})
        }

        return res.json({
            customerId,
            message: 'Customer order(s) found successfully',
            results
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'You have an internal server error'})
    }
}


//==================GET ORDER DETAIL BY ORDER ID=====================
export const getOrderDetail = async (req, res) => {
    try {
        const orderId = req.params.order_id
        if (!orderId) {
            return res.status(400).json({error: 'Order id is required'})
        }
        const results = await getOrderDetailByOrderId(orderId)
        if (!results) {
            return res.status(404).json({error: 'Order could not be found'})
        }

        return res.json({
            orderId,
            message: 'Order detail found successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'You have an internal server error'})
    }
}