//================IMPORTS===================
import express from "express";

import{
    //GET
    getOrderByCustomer,
    getOrderDetail,
    //POST
    createOrder,
    //PATCH
    patchOrder,
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
router.post('/:customer_id/',createOrder)

//===================PATCH=======================
router.patch('/:id', patchOrder)
//order_status : cancelled (pour l'admin)


//Pas de delete car on ne veut pas supprimer une commande, on va plutôt la passer en 'cancelled' dans le patch

