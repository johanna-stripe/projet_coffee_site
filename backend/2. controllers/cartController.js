//==============IMPORTS==================
import {
    getCartByCustomerId
} from "../3. services/cartService.js";


//==================GET CART BY CUSTOMER ID=====================
export const getCart = async (req, res) => {
    try {
        const customerId = req.params.customer_id

        if (!customerId) {
            return res.status(400).json({error: 'Customer Id is required'})
        }

        const results = await getCartByCustomerId(customerId)
        if (!results || results.affectedRows === 0) {
            return res.status(400).json({error: 'Customer could not be found'})
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