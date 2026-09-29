//=============================IMPORTS=============================
import express from "express";
import {
    //GET
    getAllProducts, getFullInfoFromProducts,
    //POST
    createProduct,
    //PUT
    putProduct,
    //PATCH
    patchProduct,
    //DELETE
    deleteProduct,
} from "../controllers/productController.js";
import {authenticate} from "../security/midddleware/authMiddleware.js";
import {authorizeRole} from "../security/midddleware/roleMiddleware.js";

const router = express.Router();
// on utiliser .Router pour pouvoir passer d'un fichier à l'autre en MVC
// on aurait utilisé juste app = express() si on était en monolitique


//===================GET========================
//Lister les produits — GET /products
router.get('/', getAllProducts)

//Détail d'un produit — GET /products/:id
router.get('/:id', getFullInfoFromProducts)

//===================POST========================
router.post('/', authenticate, authorizeRole('ADMIN'), createProduct)

//===================PUT========================
//Modifier un produit
router.put('/:id',authenticate, authorizeRole('ADMIN'), putProduct)

//===================PATCH========================
//Modifier des caractèristiques précises d'un produit
router.patch('/:id', authenticate, authorizeRole('ADMIN'), patchProduct)

//===================DELETE========================
router.delete('/:id', authenticate, authorizeRole('ADMIN'), deleteProduct)

export default router
