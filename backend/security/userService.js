import {
    findAllUsers,
    getByIdUser,
    findUserByEmail,
    createUser,
    updateUserById,
    updateUserRole,
    deactivate
} from "./userModel.js";
import {errorBuilder} from "../private methods/privateMethods.js";


//===========GET ALL USERS===============
export const getUsers = async () => {
    const results = await findAllUsers()

    if (!results) {
        return null
    }
    return results
}

//===========GET USER BY ID===============
export const getUser = async (userId) => {
    const rows = await getByIdUser(userId)
    if (!rows) {
        return null
    }
    return {
        user_name: rows.user_name,
        email: rows.email,
        role: rows.role,
    }
}


//===========POST USER===============
export const createNewUser = async (userData) => {
    const {user_name, email, password, role} = userData

    const existingUser = await findUserByEmail(email)
    if (existingUser) throw errorBuilder('User already exists')

    const userValues = [
        user_name,
        email,
        password,
        role
    ]
    return await createUser(userValues)
}

//===========PATCH USER===============
export const modifyUser = async (userId, updates) => {
    const allowed_updates = ['user_name', 'password']
    const fields_to_update = []
    const values_to_update = []

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


export const updateRoleByUserId = async (userId, updates) => {
    const allowedUpdate = ['role']
    const fieldsToUpdate = []
    const valuesToUpdate = []

    const existingUser = await getByIdUser(userId)
    if (!existingUser) throw errorBuilder('User does not exist')

    allowedUpdate.forEach((field) => {
        if (updates[field] !== undefined) {
            fieldsToUpdate.push(field)
            valuesToUpdate.push(updates[field])
        }
    })

    if (fieldsToUpdate.length === 0) {
        throw errorBuilder('No valid fields to update')
    }

    return await updateUserRole (userId,valuesToUpdate)
}


export const updateActivateByUserId = async (userId, updates) => {
    const allowedUpdate = ['is_active']
    const fieldsToUpdate = []
    const valuesToUpdate = []

    const existingUser = await getByIdUser(userId)
    if (!existingUser) throw errorBuilder('User does not exist')

    allowedUpdate.forEach((field) => {
        if (updates[field] !== undefined) {
            fieldsToUpdate.push(field)
            valuesToUpdate.push(updates[field])
        }
    })

    if (fieldsToUpdate.length === 0) {
        throw errorBuilder('No valid fields to update')
    }

    return await deactivate(userId,valuesToUpdate)
}