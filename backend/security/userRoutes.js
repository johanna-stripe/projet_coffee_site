import express from "express";
import {
    getAllUsers,
    getUserById,
    postUser,
    updateUser,
    patchUserRole,
    patchUserActivate
} from "./userController.js";

const router = express.Router();
export default router

//===========GET===============
router.get('/', getAllUsers)

router.get('/:id', getUserById)

//===========POST===============
router.post('/', postUser)

//===========PATCH===============
router.patch('/:id', updateUser)

router.patch('/:id/change-role', patchUserRole)

router.patch('/:id/activate', patchUserActivate)

