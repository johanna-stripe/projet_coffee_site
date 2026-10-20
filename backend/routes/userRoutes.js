import express from "express";
import {
    getAllUsers,
    getUserById,
    postUser,
    updateUser,
    patchUserRole,
    patchUserActivate,
    patchUserDeactivate
} from "../controllers/userController.js";
import {authenticate} from "../security/middleware/authMiddleware.js";
import {authorizeRole} from "../security/middleware/roleMiddleware.js";

const router = express.Router();
export default router

//===========GET===============
router.get('/', authenticate, authorizeRole('ADMIN'), getAllUsers)

router.get('/:id', authenticate, authorizeRole('ADMIN'), getUserById)

//===========POST===============
router.post('/newUser/', authenticate, authorizeRole('ADMIN'), postUser)

//===========PATCH===============
router.patch('/update-user/:id', authenticate, updateUser)

router.patch('/change-role/:id', authenticate, authorizeRole('ADMIN'), patchUserRole)

router.patch('/activate-user/:id', authenticate, authorizeRole('ADMIN'), patchUserActivate)

router.patch('/deactivate-user/:id', authenticate, authorizeRole('ADMIN'), patchUserDeactivate)

