//==============IMPORTS==================
import {
    //GET
    findCustomerById,
    findCustomerAddressesById,
    //DELETE
    deleteCustomerById,
    deleteCustomerAddressById,
} from "../4. models/customerModel.js";


//==================GET CUSTOMER BY ID=====================
export const getCustomerById = async (customerId) => {
    const rows = await findCustomerById(customerId)
    if (!rows) {
        return null
    }
    return {
        customer_id: rows.customer_id,
        password_hash: rows.password_hash,
        first_name: rows.first_name,
        last_name: rows.last_name,
        phone_number: rows.phone_number
    }
}


//==================GET CUSTOMER ADDRESSES=====================
export const getCustomerAddressesById = async (customerId) => {
    const rows = await findCustomerAddressesById(customerId)
    if (rows.length === 0) {
        return null
    }
    return rows.map(row => ({
//map : rows est le tableau de [results] donc si un client a plusieurs addresses, il faut transformer chaque ligne du tableau en un nouvel objet
        address_id: row.address_id,
        customer_id: row.customer_id,
        street: row.street,
        city: row.city,
        postcode: row.postcode,
        country: row.country
    }))
}


//==================DELETE CUSTOMER=====================
export const deleteByIdCustomer = async (customerId) => {
    const results = await deleteCustomerById(customerId)
    if (!results || results.affectedRows === 0) {
        return null
    }
    return results
}

//==================DELETE CUSTOMER ADDRESS=====================
export const deleteByIdCustomerAddress = async (customerId,customerAddress) => {
    const results = await deleteCustomerAddressById(customerId,customerAddress)
    if (!results || results.affectedRows === 0) {
        return null
    }
    return results
}