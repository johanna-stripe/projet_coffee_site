import {
    getUsers,
    getUser,
    createNewUser,
    modifyUser,
    updateRole,
    enableUser,
    disableUser
} from "../services/userService.js";

import {errorBuilder} from "../private methods/privateMethods.js";
import bcrypt from "bcrypt";
import {getByIdUser} from "../models/userModel.js";


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
        if (!results || !results.user_id) throw errorBuilder('User could not be created')

        return res.json({
            message: 'User created',
            data: results // on ne renvoie plus req.body (il contenait le mot de passe en clair)
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//===================PATCH=======================
export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) return res.status(400).json({message: 'User Id is required'})

        // Un utilisateur ne modifie que son propre compte (seul un admin peut modifier celui d'un autre)
        if (Number(userId) !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({message: 'Access Denied'})
        }

        const updates = {...req.body}

        if (updates.new_password) {
            if (!updates.current_password) {
                return res.status(400).json({message: 'Mot de passe actuel requis'})
            }

            const existingUser = await getByIdUser(userId)
            if (!existingUser) {
                return res.status(404).json({message: 'Utilisateur introuvable'})
            }

            const isMatch = await bcrypt.compare(updates.current_password, existingUser.password)
            if (!isMatch) {
                return res.status(401).json({message: 'Mot de passe actuel incorrect'})
            }
        }

        if (updates.birth_date) {
            updates.birth_date = updates.birth_date.split('T')[0]
        }

        const results = await modifyUser(userId, updates)
        return res.json({message: 'User modified successfully', results})

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


export const patchUserRole = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) throw errorBuilder('User Id is required')

        // Un admin ne peut pas changer son propre rôle (sinon il pourrait se retirer l'accès admin)
        if (Number(userId) === req.user.id) throw errorBuilder('You cannot change your own role', 403)

        const role = req.body.role
        if (!req.body) throw errorBuilder('User role is required')

        const results = await updateRole(userId, role)
        if (!results || results.affectedRows === 0) throw errorBuilder('User role could not be updated')

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
        if (!results || results.affectedRows === 0) throw errorBuilder('User could not be deactivated')

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

        // Un admin ne peut pas désactiver son propre compte (il ne pourrait plus se reconnecter)
        if (Number(userId) === req.user.id) throw errorBuilder('You cannot deactivate your own account', 403)

        const results = await disableUser(userId)
        if (!results || results.affectedRows === 0) throw errorBuilder('User could not be deactivated')

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


