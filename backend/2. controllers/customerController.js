//==============IMPORTS==================
import {
    getCustomerById,
    getCustomerAddressesById,
} from "../3. services/customerService.js";

//==================GET CUSTOMER BY ID=====================
export const getCustomerProfile = async (req, res) => {
    try {
        const customerId = req.params.id
        if (!customerId) {
            res.status(400).json({error: 'Customer Id is required'})
        }
        const results = await getCustomerById(customerId)
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

//==================GET CUSTOMER ADDRESSES=====================
export const getCustomerAddresses = async (req, res) => {
    try {
        const customerId = req.params.id
        if (!customerId) {
            res.status(400).json({error: 'Customer Id is required'})
        }
        const results = await getCustomerAddressesById(customerId)
        if (!results || results.affectedRows === 0) {
            return res.status(400).json({error: 'Customer could not be found'})
        }

        return res.json({
            customerId,
            message: 'Customer addresse(s) found successfully',
            results
        })

    } catch (error) {
        console.log('You have a Server error')
        return res.status(500).json({message: 'Internal server error'})
    }
}