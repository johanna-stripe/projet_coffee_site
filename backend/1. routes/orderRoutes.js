//==============IMPORTS==================
import express from "express";

import{
    getOrderByCustomer,
    getOrderDetail
} from "../2. controllers/orderController.js";


const router = express.Router();
// on utiliser .Router pour pouvoir passer d'un fichier à l'autre en MVC
// on aurait utilisé juste app = express() si on était en monolitique
export default router


// ==================CRUD OPERATIONS===================


//===================GET========================
//Lister toutes les commandes d'un client
router.get('/:customer_id', getOrderByCustomer)

//Lister le détail d'une commande
router.get('/detail/:order_id',getOrderDetail)

//===================POST========================

//===================PUT=========================

//===================PATCH=======================

//===================DELETE=======================