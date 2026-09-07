import {
    getUsers,
    getUser,
    createNewUser,
    modifyUser,
    updateRole,
    enableUser,
    disableUser
} from "./userService.js";

import {errorBuilder} from "../private methods/privateMethods.js";
import {authorizeRole} from "./midddleware/roleMiddleware.js";


//===========GET ALL USERS===============
export const getAllUsers = async (req, res) => {
    try {
        const results = await getUsers()
        if (!results) return res.status(400).json('Could not find any user')

        return res.json({
            results,
            message: 'Here are all users:'
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//===========GET USER BY ID===============
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) return res.status(400).json('User Id is required')

        const results = await getUser(userId)
        if (!results) return res.status(400).json('User Id does not exist')

        return res.json({
            userId,
            results,
            message: 'User found successfully:'
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//==================CREATE USER=====================
export const postUser = async (req, res) => {
    try {
        if (!req.body) throw errorBuilder('User data is required')

        const results = await createNewUser(req.body)
        if (!results || results.affectedRows === 0) throw errorBuilder('User could not be created')

        return res.json({
            message: 'User created',
            data: {
                id: results.insertId,
                ...req.body
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//===================PATCH=======================
export const updateUser = async(req,res)=>{
    try {
        const userId = req.params.id
        if (!userId) return res.status(400).json('User Id is required')

        const results = await modifyUser(userId)

        return res.json({
            message: 'User modified successfully:',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


export const patchUserRole = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) throw errorBuilder('User Id is required')

        const role = req.body.role
        if (!req.body) throw errorBuilder('User role is required')

        const results = await updateRole(userId, role)
        if(!results || results.affectedRows===0) throw errorBuilder('User role could not be updated')

        return res.json({
            userId,
            message: 'User role updated successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


export const patchUserActivate = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) throw errorBuilder('User Id is required')

        const results = await enableUser(userId)
        if(!results || results.affectedRows===0) throw errorBuilder('User could not be deactivated')

        return res.json({
            userId,
            message: 'User activated successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}

export const patchUserDeactivate = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) throw errorBuilder('User Id is required')

        const results = await disableUser(userId)
        if(!results || results.affectedRows===0) throw errorBuilder('User could not be deactivated')

        return res.json({
            userId,
            message: 'User deactivated successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


