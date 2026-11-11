import {
    findAllUsers,
    getByIdUser,
    findUserByEmail,
    saveUserWithCustomer,
    updateUserById,
    updateUserRole,
    deactivate, activate
} from "../models/userModel.js";
import {
    findCustomerByUserId,
    createANewCustomer,
    modifyCustomerByUserId,
} from "../models/customerModel.js";
import {errorBuilder, normalizeEmailAddress, normalizePhoneNumber} from "../private methods/privateMethods.js";
import {hashPassword} from "../security/helper/passwordUtiles.js";


//===========GET ALL USERS===============
export const getUsers = async () => {
    const results = await findAllUsers()
    if (!results) throw errorBuilder('Not found',404)
    return results
}

//===============GET USER BY ID=================
export const getUser = async (userId) => {
    const user = await getByIdUser(userId)
    if (!user) throw errorBuilder('Not found',404)
    return {
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        // infos venant de la table customer
        first_name: user.first_name,
        last_name: user.last_name,
        customer_email: user.customer_email,
        phone: user.phone,
        birth_date: user.birth_date,
    }
}

//==============POST USER (admin)==================
// username, email, password obligatoires (table users)
// first_name + last_name optionnels : s'ils sont fournis, on crée aussi la fiche customer
export const createNewUser = async (userData) => {
    const {password, role, first_name, last_name, phone, birth_date} = userData

    const username = typeof userData.username === 'string' ? userData.username.trim() : ''
    if (!username || !userData.email || !password) throw errorBuilder('Username, email and password are mandatory')

    const email = normalizeEmailAddress(userData.email)   // lève une 400 si l'email n'est pas valide

    if (typeof password !== 'string' || password.length < 8 || password.length > 16) throw errorBuilder('Your password should contain 8 to 16 characters')

    // le rôle vient d'un formulaire : liste blanche, comme pour le changement de rôle
    const allowedRoles = ['USER', 'ADMIN']
    const finalRole = role || 'USER'
    if (!allowedRoles.includes(finalRole)) throw errorBuilder('Invalid Role')

    const cleanPhone = phone ? normalizePhoneNumber(phone) : ''
    if (phone && !cleanPhone) throw errorBuilder('Phone number not valid')

    const existingUser = await findUserByEmail(email)
    if (existingUser) throw errorBuilder('User already exists', 409)

    const hashedPassword = await hashPassword(password)

    const customer = (first_name && last_name)
        ? {first_name: first_name.trim(), last_name: last_name.trim(), customer_email: email, phone: cleanPhone || null, birth_date}
        : null

    return await saveUserWithCustomer(
        {username, email, password: hashedPassword, role: finalRole},
        customer
    )
}

//===========PATCH USER===============
// Les champs reçus du front sont répartis entre les 2 tables :
//  - users    : username, email, new_password
//  - customer : first_name, last_name, phone, birth_date
export const modifyUser = async (userId, updates) => {
    const userFieldMap = {
        username: 'username',
        email: 'email',
        new_password: 'password'
    }
    const customerFieldMap = {
        first_name: 'first_name',
        last_name: 'last_name',
        phone: 'phone',
        birth_date: 'birth_date'
    }

    //----- table users -----
    const userFields = []
    const userValues = []
    for (const [key, column] of Object.entries(userFieldMap)) {
        if (updates[key] === undefined) continue
        userFields.push(column)
        userValues.push(key === 'new_password' ? await hashPassword(updates[key]) : updates[key])
    }

    //----- table customer -----
    const customerFields = []
    const customerValues = []
    for (const [key, column] of Object.entries(customerFieldMap)) {
        if (updates[key] === undefined) continue
        customerFields.push(column)
        customerValues.push(updates[key] === '' ? null : updates[key])
    }

    if (userFields.length === 0 && customerFields.length === 0) throw errorBuilder('No field to update', 400)

    const results = {}

    if (userFields.length > 0) {
        if (updates.email !== undefined) {
            const other = await findUserByEmail(updates.email)
            if (other && String(other.user_id) !== String(userId)) throw errorBuilder('The email already exists', 409)
        }
        results.user = await updateUserById(userFields, [...userValues, userId])
    }

    if (customerFields.length > 0) {
        const customer = await findCustomerByUserId(userId)
        if (customer) {
            results.customer = await modifyCustomerByUserId(customerFields, [...customerValues, userId])
        } else {
            // pas encore de fiche customer -> on la crée (prénom + nom obligatoires)
            if (!updates.first_name || !updates.last_name) {
                throw errorBuilder('First name and last name are required to create the customer profile', 400)
            }
            const user = await getByIdUser(userId)
            if (!user) throw errorBuilder('User not found', 404)
            results.customer = await createANewCustomer([
                userId,
                updates.first_name,
                updates.last_name,
                user.email,
                updates.phone || null,
                updates.birth_date || null
            ])
        }
    }

    return results
}


export const updateRole = async (userId, role) => {
    const allowedRoles = ['USER', 'ADMIN']
    if (!allowedRoles.includes(role)) throw errorBuilder('Invalid Role')

    const updateUser = await updateUserRole(userId, role)
    if (!updateUser) throw errorBuilder(`User Id with ${userId} not found`, 404)

    return updateUser
}


export const enableUser = async (userId) => {
    const updatedUser = await activate(userId)
    if(!updatedUser) throw errorBuilder(`User Id with ${userId} not found`, 404)
    return updatedUser
}

export const disableUser = async (userId) => {
    const updatedUser = await deactivate(userId)
    if(!updatedUser) throw errorBuilder(`User Id with ${userId} not found`, 404)
    return updatedUser
}
