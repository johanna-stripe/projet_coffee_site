//==============IMPORTS==================
import {
    //GET
    getCustomerById,
    getCustomerAddressesById,
    //DELETE
    deleteByIdCustomer,
    deleteByIdCustomerAddress,
} from "../3. services/customerService.js";

//==================GET CUSTOMER BY ID=====================
export const getCustomerProfile = async (req, res) => {
    try {
        const customerId = req.params.id
        if (!customerId) {
            return res.status(400).json({error: 'Customer Id is required'})
        }
        const results = await getCustomerById(customerId)
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

//==================GET CUSTOMER ADDRESSES=====================
export const getCustomerAddresses = async (req, res) => {
    try {
        const customerId = req.params.id
        if (!customerId) {
            return res.status(400).json({error: 'Customer Id is required'})
        }
        const results = await getCustomerAddressesById(customerId)
        if (!results) {
            return res.status(404).json({error: 'Customer could not be found'})
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

//==================DELETE CUSTOMER BY ID=====================
export const deleteCustomerAccount = async (req, res) => {
    try {
        const customerId = req.params.id
        if (!customerId) {
            return res.status(400).json({error: 'Customer Id is required'})
        }
        const results = await deleteByIdCustomer(customerId)
        if(!results){
            return res.status(404).json({error: 'Customer could not be found'})
        }
        return res.json({
            customerId,
            message: 'Customer has been deleted',
            results
        })

    } catch
        (error) {
        console.log('You have a Server error')
        return res.status(500).json({message: 'Internal server error'})
    }
}

//==================DELETE CUSTOMER ADDRESS=====================
export const deleteCustomerAddress = async (req, res) => {
    try {
        const customerId = req.params.id
        if (!customerId) {
            return res.status(400).json({error: 'Customer Id is required'})
        }
        const customerAddress = req.params.address_id
        if (!customerAddress) {
            return res.status(400).json({error: 'Address Id is required'})
        }

        const results = await deleteByIdCustomerAddress(customerId,customerAddress)
        if(!results){
            return res.status(404).json({error: 'Customer address could not be found'})
        }
        return res.json({
            customerId, customerAddress,
            message: 'Customer Address has been deleted',
            results
        })

    } catch
        (error) {
        console.log('You have a Server error')
        return res.status(500).json({message: 'Internal server error'})
    }
}
