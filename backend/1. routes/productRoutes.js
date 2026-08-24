//=============================IMPORTS=============================
import express from "express";

import {
    //GET
    getAllProducts,
    getFullInfoFromProducts,
    //POST
    createProduct,
    //PUT
    putProduct,
    //PATCH
    patchProduct,
    //DELETE
    deleteProduct,
} from "../2. controllers/productController.js";


const router = express.Router();
// on utiliser .Router pour pouvoir passer d'un fichier à l'autre en MVC
// on aurait utilisé juste app = express() si on était en monolitique


//===================GET========================
//Lister les produits — GET /products
router.get('/', getAllProducts)

//Détail d'un produit — GET /products/:id
router.get('/:id', getFullInfoFromProducts)

//===================POST========================
router.post('/', createProduct)

//===================PUT========================
//Modifier un produit
router.put('/:id', putProduct)

//===================PATCH========================
//Modifier des caractèristiques précises d'un produit
router.patch('/:id',patchProduct)

//===================DELETE========================
router.delete('/:id',deleteProduct)

export default router