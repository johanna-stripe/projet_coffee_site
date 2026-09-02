import {
    findAllUsers,
    getByIdUser,
    updateUserById,
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