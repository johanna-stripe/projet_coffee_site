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
    deleteCustomerAddressById, findCustomerByUserId,
} from "../models/customerModel.js";

import {
    normalizeText,
    normalizeEmailAddress,
    errorBuilder, normalizePhoneNumber
} from "../private methods/privateMethods.js";

//==================GET CUSTOMER BY ID=====================
export const getCustomerById = async (customerId) => {
    const customer = await findCustomerById(customerId)
    if (!customer) throw errorBuilder('Not found', 404)
    return {
        customer_id: customer.customer_id,
        user_id: customer.user_id,          // NULL = client invité
        first_name: customer.first_name,
        last_name: customer.last_name,
        customer_email: customer.customer_email,
        phone: customer.phone,
        birth_date: customer.birth_date
    }
}

//==================GET CUSTOMER BY USER_ID=====================
export const getMyCustomerProfile = async (userId) => {
    const customer = await findCustomerByUserId(userId)
    if (!customer) throw errorBuilder('Customer profile not found', 404)

    const addresses = await findCustomerAddressesById(customer.customer_id)

    return { customer, addresses }
}

//==================GET CUSTOMER ADDRESSES=====================
export const getCustomerAddressesById = async (customerId) => {
    const rows = await findCustomerAddressesById(customerId)
    if (!rows || rows.length === 0) throw errorBuilder('Not found', 404)
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
// user_id facultatif : sans user_id = client invité
export const createNewCustomer = async (customerData) => {
    const {user_id, first_name, last_name, birth_date} = customerData
    const customer_email = customerData.customer_email ?? customerData.email_address
    const phone = customerData.phone ?? customerData.phone_number

    const cleanFirstName = normalizeText(first_name)
    if (!cleanFirstName) throw errorBuilder('First name is required', 400)

    const cleanLastName = normalizeText(last_name)
    if (!cleanLastName) throw errorBuilder('Last name is required', 400)

    const cleanEmailAddress = normalizeEmailAddress(customer_email)
    if (!cleanEmailAddress) throw errorBuilder('correct email address is required : example@email.com', 400)

    // téléphone facultatif (colonne NULL)
    const cleanPhoneNumber = phone ? normalizePhoneNumber(phone) : null
    if (phone && !cleanPhoneNumber) throw errorBuilder('correct phone number is required. Example: 06 12 34 56 78', 400)

    const values = [
        user_id || null,
        cleanFirstName,
        cleanLastName,
        cleanEmailAddress,
        cleanPhoneNumber,
        birth_date || null
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
    const allowed_updates = ['first_name', 'last_name', 'customer_email', 'phone', 'birth_date']
    const fields_to_update = []
    const values_to_update = []

    allowed_updates.forEach((field) => {
        if (changes[field] !== undefined) { //pour chaque élément de allowed_updates si changes (donc mon req.body) a un élément modifié (donc !==undefined)
            fields_to_update.push(field); //on push dans la colonne
            if (field === 'first_name' || field === 'last_name') {
                values_to_update.push(normalizeText(changes[field]))
            } else if (field === 'customer_email') {
                values_to_update.push(normalizeEmailAddress(changes[field]))
            } else if (field === 'phone') {
                values_to_update.push(changes[field] ? normalizePhoneNumber(changes[field]) : null)
            } else if (field === 'birth_date') {
                values_to_update.push(changes[field] || null)
            }
        }
    })

    if (fields_to_update.length === 0) throw errorBuilder('No field to update')

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

    if (fields_to_update.length === 0) throw errorBuilder('No field to update')

    values_to_update.push(addressId)

    return await modifyByPatchCustomerAddress(fields_to_update, values_to_update)
}


//==================DELETE CUSTOMER=====================
export const deleteByIdCustomer = async (customerId) => {
    const results = await deleteCustomerById(customerId)
    if (!results || results.affectedRows === 0) throw errorBuilder('Not found',404)
    return results
}

//==================DELETE CUSTOMER ADDRESS=====================
export const deleteByIdCustomerAddress = async (customerId, customerAddress) => {
    const results = await deleteCustomerAddressById(customerId, customerAddress)
    if (!results || results.affectedRows === 0) throw errorBuilder('Not found',404)
    return results
}