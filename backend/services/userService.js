import {
    findAllUsers,
    getByIdUser,
    findUserByEmail,
    createUser,
    updateUserById,
    updateUserRole,
    deactivate, activate
} from "../models/userModel.js";
import {errorBuilder} from "../private methods/privateMethods.js";
import {hashPassword} from "../security/helper/passwordUtiles.js";
import bycrypt from "bcrypt";


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
        first_name: user.first_name,
        last_name: user.last_name,
        user_email : user.user_email,
        role: user.role,
    }
}

//==============POST USER==================
export const createNewUser = async (userData) => {
    const {first_name, last_name, user_email, phone, birth_date, password, role} = userData

    if (!first_name || !last_name || !user_email || !phone || !birth_date || !password) throw errorBuilder('All fields are mandatory')

    if (password.length < 8 || password.length > 16) throw errorBuilder('Your password should contain 8 to 16 characters')

    const existingUser = await findUserByEmail(user_email)
    if (existingUser) throw errorBuilder('User already exists')

    const hashedPassword = await hashPassword(password)

    const userValues = [
        first_name,
        last_name,
        user_email,
        phone,
        birth_date,
        hashedPassword,
        role
    ]

    return await createUser(userValues)
}

//===========PATCH USER===============
export const modifyUser = async (userId, updates) => {
    const allowed_updates = ['first_name', 'last_name', 'email', 'phone', 'birth_date', 'new_password']
    const fields_to_update = []
    const values_to_update = []

    if(updates.new_password){
        updates.new_password=await bycrypt.hash(updates.new_password, 10)
    }

    allowed_updates.forEach((field)=>{
        if(updates[field] !== undefined){
            fields_to_update.push(field)
            values_to_update.push(updates[field])
        }
    })

    if(fields_to_update.length===0) throw errorBuilder('No field to update')

    values_to_update.push(userId)

    return await updateUserById(fields_to_update, values_to_update)
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

