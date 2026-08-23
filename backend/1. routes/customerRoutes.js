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
    deleteCustomerAddress,
} from "../2. controllers/customerController.js";

const router = express.Router();
// on utiliser .Router pour pouvoir passer d'un fichier à l'autre en MVC
// on aurait utilisé juste app = express() si on était en monolitique
export default router


// ==================CRUD OPERATIONS===================

//===================GET========================

//Profil d'un client
router.get('/:id', getCustomerProfile)

router.get('/:id/addresses', getCustomerAddresses)

//===================POST========================
router.post('/',createCustomer)

router.post('/:id/address',createCustomerAddress)

//===================PATCH=======================
router.patch('/:id',patchCustomer)

router.patch('/:id/address/:address_id',patchCustomerAddress)

//===================DELETE======================
router.delete('/:id',deleteCustomerAccount)

//Adresse client
router.delete('/:id/addresses/:address_id',deleteCustomerAddress)