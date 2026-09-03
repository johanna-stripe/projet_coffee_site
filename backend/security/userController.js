import {
    getUsers,
    getUser,
    createNewUser,
    modifyUser,
    updateRoleByUserId,
    updateActivateByUserId
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
        return res.status(500).json({error: 'Internal Server Error'})
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
        return res.status(500).json({error: 'Internal Server Error'})
    }
}


//===========POST===============
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
        return res.status(500).json({error: error.message || 'Internal server error'})
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
        return res.status(500).json({error: 'Internal Server Error'})
    }
}


export const patchUserRole = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) throw errorBuilder('User Id is required')

        const isAuthorized = await authorizeRole()
        if(!isAuthorized) throw errorBuilder('Access denied')

        if (!req.body) throw errorBuilder('User data is required')

        const results = await updateRoleByUserId(userId, req.body)
        if(!results || results.affectedRows===0) throw errorBuilder('User role could not be updated')

        return res.json({
            userId,
            message: 'User role updated',
            data: {
                ...req.body
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: error.message || 'Internal server error'})
    }
}


export const patchUserActivate = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) throw errorBuilder('User Id is required')

        const isAuthorized = await authorizeRole()
        if(!isAuthorized) throw errorBuilder('Access denied')

        if (!req.body) throw errorBuilder('User data is required')

        const results = await updateActivateByUserId(userId, req.body)
        if(!results || results.affectedRows===0) throw errorBuilder('User could not be deactivated')

        return res.json({
            userId,
            message: 'User has been deactivated',
            data: {
                ...req.body
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: error.message || 'Internal server error'})
    }
}



