//==============IMPORTS==================
import express from "express";

import {
    //GET
    getCustomerProfile,
    getCustomerAddresses,
    //POST
    createCustomer,
    createCustomerAddress,
    //PATCH
    patchCustomer,
    patchCustomerAddress,
    //DELETE
    deleteCustomerAccount,
    deleteCustomerAddress, getMyProfile,
} from "../controllers/customerController.js";
import {authenticate} from "../security/midddleware/authMiddleware.js";
import {authorizeRole} from "../security/midddleware/roleMiddleware.js";

const router = express.Router();
// on utiliser .Router pour pouvoir passer d'un fichier à l'autre en MVC
// on aurait utilisé juste app = express() si on était en monolitique
export default router


// ==================CRUD OPERATIONS===================

//===================GET========================
//Profil d'un client
router.get('/:id', authenticate, getCustomerProfile)

router.get('/:id/addresses', authenticate, getCustomerAddresses)

router.get('/me', authenticate, getMyProfile)

//===================POST========================
router.post('/', authenticate, authorizeRole('ADMIN'), createCustomer)

router.post('/:id/address', authenticate, createCustomerAddress)

//===================PATCH=======================
router.patch('/:id', authenticate, patchCustomer)

router.patch('/:id/address/:address_id', authenticate, patchCustomerAddress)

//===================DELETE======================
router.delete('/:id', authenticate, deleteCustomerAccount)

//Adresse client
router.delete('/:id/addresses/:address_id', authenticate, deleteCustomerAddress)