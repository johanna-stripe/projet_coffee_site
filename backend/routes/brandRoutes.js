//=============================IMPORTS=============================
import express from "express";

import {
    //GET
    getAllBrands,
    getBrandById,
    getProductsByBrand,
    //POST
    createABrand,
    //PUT
    modifyBrand,
    //DELETE
    deleteBrand,
} from "../controllers/brandController.js";
import {authenticate} from "../security/middleware/authMiddleware.js";
import {authorizeRole} from "../security/middleware/roleMiddleware.js";

const router = express.Router();
export default router

//===================GET========================
//Voir toutes les marques
router.get('/', getAllBrands)

//Voir le détail d'une marque
router.get('/:id', getBrandById)

//Voir la liste des produits d'une marque
router.get('/:id/products', getProductsByBrand)

//===================POST========================
router.post('/', authenticate, authorizeRole('ADMIN'), createABrand)

//====================PUT=========================
router.put('/:id', authenticate, authorizeRole('ADMIN'), modifyBrand)

//===================DELETE=======================
router.delete('/:id', authenticate, authorizeRole('ADMIN'), deleteBrand)


