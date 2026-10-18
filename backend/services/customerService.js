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
    setDefaultCustomerAddress,
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
// Pour une adresse on garde les majuscules (« 12 rue des Oliviers », « Aix-en-Provence ») :
// on enlève seulement les espaces autour, sans passer en minuscules comme normalizeText.
const trimText = (text) => (typeof text === "string" ? text.trim() : "")

export const createNewCustomerAddress = async (customerId, customerAddressData) => {
    const {address_name, street, city, postcode, country} = customerAddressData

    const cleanStreet = trimText(street)
    if (!cleanStreet) throw errorBuilder('Street is required', 400)

    const cleanCity = trimText(city)
    if (!cleanCity) throw errorBuilder('City is required', 400)

    const cleanPostcode = trimText(postcode)
    if (!cleanPostcode) throw errorBuilder('Postcode is required', 400)

    const cleanCountry = trimText(country)
    if (!cleanCountry) throw errorBuilder('Country is required', 400)

    // La toute première adresse du client devient automatiquement l'adresse par défaut
    const existingAddresses = await findCustomerAddressesById(customerId)
    const isDefault = existingAddresses.length === 0 ? 1 : 0

    const values = [
        trimText(address_name) || null, // étiquette facultative : « Domicile », « Bureau »...
        isDefault,
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
    const allowed_updates = ['address_name', 'street', 'city', 'postcode', 'country']
    const fields_to_update = []
    const values_to_update = []

    allowed_updates.forEach((field) => {
        if (changes[field] !== undefined) { //pour chaque élément de allowed_updates si changes (donc mon req.body) a un élément modifié (donc !==undefined)
            const value = trimText(changes[field])
            if (!value && field !== 'address_name') throw errorBuilder(`${field} cannot be empty`, 400)
            fields_to_update.push(field); //on push dans la colonne
            values_to_update.push(value || null)
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
    const addresses = await findCustomerAddressesById(customerId)
    const deleted = addresses.find(address => String(address.address_id) === String(customerAddress))

    const results = await deleteCustomerAddressById(customerId, customerAddress)
    if (!results || results.affectedRows === 0) throw errorBuilder('Not found',404)

    // Si on vient de supprimer l'adresse par défaut, la plus ancienne qui reste prend le relais
    if (deleted?.is_default) {
        const remaining = addresses.filter(address => address.address_id !== deleted.address_id)
        if (remaining.length > 0) {
            const oldest = remaining.reduce((a, b) => (a.address_id < b.address_id ? a : b))
            await setDefaultCustomerAddress(customerId, oldest.address_id)
        }
    }
    return results
}

//==================ADRESSE PAR DÉFAUT=====================
export const setDefaultAddress = async (customerId, addressId) => {
    const results = await setDefaultCustomerAddress(customerId, addressId)
    if (!results || results.affectedRows === 0) throw errorBuilder('Address not found for this customer', 404)
    return results
}
