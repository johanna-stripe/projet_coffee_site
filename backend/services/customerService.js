//==============IMPORTS==================
import {
    //GET
    findCustomerById,
    findCustomerAddressesById,
    //POST
    createANewCustomer,
    createANewCustomerAddress,
    //PATCH
    modifyByPatchCustomer,
    modifyByPatchCustomerAddress,
    //DELETE
    deleteCustomerById,
    deleteCustomerAddressById,
} from "../models/customerModel.js";

import {
    normalizeText,
    normalizeEmailAddress,
    errorBuilder, normalizePhoneNumber
} from "../private methods/privateMethods.js";

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

//==================POST CUSTOMER=====================
export const createNewCustomer = async (customerData) => {
    const {password, first_name, last_name, email_address, phone_number} = customerData

    const cleanFirstName = normalizeText(first_name)
    if (!cleanFirstName) throw errorBuilder('First name is required', 400)

    const cleanLastName = normalizeText(last_name)
    if (!cleanLastName) throw errorBuilder('Last name is required', 400)

    const cleanEmailAddress = normalizeEmailAddress(email_address)
    if (!cleanEmailAddress) throw errorBuilder('correct email address is required : example@email.com', 400)

    const cleanPhoneNumber = normalizePhoneNumber(phone_number)
    if (!cleanPhoneNumber) throw errorBuilder('correct phone number is required. Example: 06 12 34 56 78', 400)

    const values = [
        password,
        cleanFirstName,
        cleanLastName,
        cleanEmailAddress,
        cleanPhoneNumber
    ]
    return await createANewCustomer(values)
}

//==================POST CUSTOMER ADDRESS=====================
export const createNewCustomerAddress = async (customerId, customerAddressData) => {
    const {street, city, postcode, country} = customerAddressData

    const cleanStreet = normalizeText(street)
    if (!cleanStreet) throw errorBuilder('Street is required', 400)

    const cleanCity = normalizeText(city)
    if (!cleanCity) throw errorBuilder('City is required', 400)

    const cleanPostcode = normalizeText(postcode)
    if (!cleanPostcode) throw errorBuilder('Postcode is required', 400)

    const cleanCountry = normalizeText(country)
    if (!cleanCountry) throw errorBuilder('Country is required', 400)

    const values = [
        cleanStreet,
        cleanCity,
        cleanPostcode,
        cleanCountry
    ]
    return await createANewCustomerAddress(customerId, values)
}

//==================PATCH CUSTOMER=====================
export const modifyCustomerByPatch = async (customerId, changes) => {
    const allowed_updates = ['password_hash', 'first_name', 'last_name', 'email_address', 'phone_number']
    const fields_to_update = []
    const values_to_update = []

    allowed_updates.forEach((field) => {
        if (changes[field] !== undefined) { //pour chaque élément de allowed_updates si changes (donc mon req.body) a un élément modifié (donc !==undefined)
            fields_to_update.push(field); //on push dans la colonne
            if (field === 'first_name') {
                values_to_update.push(normalizeText(changes[field]))
            } else if (field === 'last_name') {
                values_to_update.push(normalizeText(changes[field]))
            } else if (field === 'email_address') {
                values_to_update.push(normalizeEmailAddress(changes[field]))
            } else if (field === 'phone_number') {
                values_to_update.push(normalizePhoneNumber(changes[field]))
            } else if (field === 'password_hash') {
                values_to_update.push(changes[field]);
            }
        }
    })

    if (fields_to_update.length === 0) throw errorBuilder('No field to update', 400)

    values_to_update.push(customerId)

    return await modifyByPatchCustomer(fields_to_update, values_to_update)
}

//==================PATCH CUSTOMER ADDRESS=====================
export const modifyCustomerAddressByPatch = async (addressId, changes) => {
    const allowed_updates = ['street', 'city', 'postcode', 'country']
    const fields_to_update = []
    const values_to_update = []

    allowed_updates.forEach((field) => {
        if (changes[field] !== undefined) { //pour chaque élément de allowed_updates si changes (donc mon req.body) a un élément modifié (donc !==undefined)
            fields_to_update.push(field); //on push dans la colonne
            values_to_update.push(normalizeText(changes[field]))
        }
    })

    if (fields_to_update.length === 0) throw errorBuilder('No field to update', 400)

    values_to_update.push(addressId)

    return await modifyByPatchCustomerAddress(fields_to_update, values_to_update)
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

export const deleteByIdCustomerAddress = async (customerId, customerAddress) => {
    const results = await deleteCustomerAddressById(customerId, customerAddress)
    if (!results || results.affectedRows === 0) {
        return null
    }
    return results
}