//==============IMPORTS==================
import {
    //GET
    getAllOrdersList,
    getOrderByCustomerId,
    getOrderDetailByOrderId,
    //POST
    createNewOrder,
    //PATCH
    modifyOrderByPatch,
} from "../services/orderService.js";
import {createNewCategory} from "../services/categoriesService.js";


//==================GET ALL ORDERS (ADMIN)=====================
export const getAllOrders = async (req, res) => {
    try {
        const results = await getAllOrdersList()
        return res.json({
            message: 'Orders found successfully',
            results
        })
    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


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
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
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
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//==================POST ORDER=====================
export const createOrder = async(req,res)=>{
    try {
        const customerId = req.params.customer_id
        if (!customerId) {
            return res.status(400).json({error: 'Customer id is required'})
        }

        if (!req.body) {
            return res.status(400).json({error: 'Order details are required'})
        }

        const results = await createNewOrder(customerId, req.body)
        if (!results || results.affectedRows === 0) {
            return res.status(404).json({error: 'Order could not be created'})
        }
        return res.status(201).json({
            message: 'Order created successfully',
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

//==================PATCH ORDER=====================
export const patchOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) return res.status(400).json({error:'Order Id is required'})

        if (!req.body) {
            return res.status(400).json({error: 'Order modification is required'})
        }

        const results = await modifyOrderByPatch(orderId,req.body)
        if(!results || results.affectedRows === 0) return res.status(404).json({error:'Order could not be modified'})

        return res.json({
            orderId,
            message:'Order modified successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}

