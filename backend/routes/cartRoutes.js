//==============IMPORTS==================
import express from "express";

import {
    getCart,
    addItemToCart,
    patchOrderItem,
    deleteCustomerCart,
    deleteItemFromCart, getProductsInCart,
} from "../controllers/cartController.js";
import {authenticate} from "../security/middleware/authMiddleware.js";
import {checkCartOwner, checkCustomerOwner} from "../security/middleware/cartOwnerMiddleware.js";


const router = express.Router();
// on utiliser .Router pour pouvoir passer d'un fichier à l'autre en MVC
// on aurait utilisé juste app = express() si on était en monolitique

export default router


//===================GET========================
//Voir le panier d'un client
router.get('/:customer_id', authenticate, checkCustomerOwner, getCart)

router.get('/:cart_id/products', authenticate, checkCartOwner, getProductsInCart)

//===================POST========================
//Add Item to cart
router.post('/:customer_id', authenticate, checkCustomerOwner, addItemToCart)

//===================PATCH=======================
//Modifier la quantité d'un cart_item
router.patch('/:cart_id/product/:product_id', authenticate, checkCartOwner, patchOrderItem)

//===================DELETE=======================
//delete cart
router.delete('/:cart_id/customer/:customer_id', authenticate, checkCartOwner, deleteCustomerCart)
// Customer_id ici sert pour vérifier que celui qui fait la requête a le droit de la supprimer

//delete cart_item
router.delete('/:cart_id/product/:product_id', authenticate, checkCartOwner, deleteItemFromCart)

