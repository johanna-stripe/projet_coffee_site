//==============IMPORTS==================
import {
    //GET
    getCustomerById,
    getCustomerAddressesById,
    //POST
    createNewCustomer,
    createNewCustomerAddress,
    //PATCH
    modifyCustomerByPatch,
    modifyCustomerAddressByPatch,
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
        console.log(error)
        return res.status(error.statusCode || 500).json({error: error.message || 'Internal server error'})
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
        console.log(error)
        return res.status(error.statusCode || 500).json({error: error.message || 'Internal server error'})
    }
}


//==================POST CUSTOMER=====================
export const createCustomer = async (req, res) => {
    try {
        const customerData = req.body
        if (!customerData) return res.status(400).json({error: 'Customer details are required'})

        const results = await createNewCustomer(customerData)
        if (!results || results.affectedRows === 0) return res.status(404).json({error: 'Customer could not be created'})

        return res.json({
            customerData,
            message: 'Customer has been created successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({error: error.message || 'Internal server error'})
    }
}

//==================POST CUSTOMER ADDRESS=====================
export const createCustomerAddress = async (req, res) => {
    try {
        const customerId = req.params.id
        if (!customerId) return res.status(400).json({error: 'Customer Id is required'})

        const customerAddressData = req.body
        if (!customerAddressData) return res.status(400).json({error: 'Address details are required'})

        const results = await createNewCustomerAddress(customerId, customerAddressData)
        if (!results || results.affectedRows === 0) return res.status(404).json({error: 'Address could not be created'})

        return res.json({
            customerAddressData,
            message: 'Address has been created successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({error: error.message || 'Internal server error'})
    }
}


//==================PATCH CUSTOMER=====================
export const patchCustomer = async (req, res) => {
    try {
        const customerId = req.params.id
        if (!customerId) return res.status(400).json({error: 'Customer Id is required'})

        const results = await modifyCustomerByPatch(customerId, req.body)
        if (!results || results.affectedRows === 0) return res.status(404).json({error: 'Customer could not be modified'})

        return res.json({
            customerId,
            message: 'Customer has been modified successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({error: error.message || 'Internal server error'})
    }
}

//==================PATCH CUSTOMER ADDRESS=====================
export const patchCustomerAddress = async (req, res) => {
    try {
        const addressId = req.params.address_id
        if (!addressId) return res.status(400).json({error: 'Address Id is required'})

        const results = await modifyCustomerAddressByPatch(addressId, req.body)
        if (!results || results.affectedRows === 0) return res.status(404).json({error: 'Customer address could not be modified'})

        return res.json({
            addressId,
            message: 'Customer address has been modified successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({error: error.message || 'Internal server error'})
    }
}


//==================DELETE CUSTOMER BY ID=====================
export const deleteCustomerAccount = async (req, res) => {
    try {
        const customerId = req.params.id
        if (!customerId) return res.status(400).json({error: 'Customer Id is required'})

        const results = await deleteByIdCustomer(customerId)
        if (!results) return res.status(404).json({error: 'Customer could not be found'})

        return res.json({
            customerId,
            message: 'Customer has been deleted',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({error: error.message || 'Internal server error'})

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

        const results = await deleteByIdCustomerAddress(customerId, customerAddress)
        if (!results) return res.status(404).json({error: 'Customer address could not be found'})

        return res.json({
            customerId, customerAddress,
            message: 'Customer Address has been deleted',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({error: error.message || 'Internal server error'})

    }
}
