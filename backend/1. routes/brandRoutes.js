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
} from "../2. controllers/brandController.js";

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
router.post('/', createABrand)

//====================PUT=========================
router.put('/:id', modifyBrand)

//===================PATCH========================


//===================DELETE=======================
router.delete('/:id', deleteBrand)


