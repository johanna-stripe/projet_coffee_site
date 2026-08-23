//==============IMPORTS==================
import express from "express";

import {
    //GET
    getCart,
    //POST
    createCart,
    //PATCH
    patchOrderItem,
    //DELETE
    deleteCustomerCart,
    deleteItemFromCart,
} from "../2. controllers/cartController.js";


const router = express.Router();
// on utiliser .Router pour pouvoir passer d'un fichier à l'autre en MVC
// on aurait utilisé juste app = express() si on était en monolitique

export default router


// ==================CRUD OPERATIONS===================


//===================GET========================
//Voir le panier d'un client
router.get('/:customer_id', getCart)

//===================POST========================
//Create Cart
router.post('/:customer_id', createCart)

//===================PATCH=======================
//Modifier la quantité d'un cart_item
router.patch('/:cart_id/product/:product_id', patchOrderItem)

//===================DELETE=======================
//delete cart
router.delete('/:cart_id/customer/:customer_id',deleteCustomerCart)
// Customer_id ici sert pour vérifier que celui qui fait la requête a le droit de la supprimer

//delete cart_item
router.delete('/:cart_id/product/:product_id', deleteItemFromCart)

