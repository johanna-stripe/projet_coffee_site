//==============IMPORTS==================
import express from "express";

import {
    getCart
} from "../2. controllers/cartController.js";


const router = express.Router();
// on utiliser .Router pour pouvoir passer d'un fichier à l'autre en MVC
// on aurait utilisé juste app = express() si on était en monolitique

export default router


// ==================CRUD OPERATIONS===================


//===================GET========================
//Voir le panier d'un client
router.get('/:customer_id', getCart)






