import express from "express";
import {
    register,
    login,
} from "./authController.js";

import {
    getAllUsers,
    getUserById,
    updateUser,
} from "./userController.js";



const router = express.Router();
export default router

//===========POST===============
router.post('/register', register)

router.post('/login', login)


//===========GET===============
router.get('/', getAllUsers)

router.get('/:id', getUserById)


//===========PATCH===============
router.patch('/:id', updateUser)



//update role
//update user



