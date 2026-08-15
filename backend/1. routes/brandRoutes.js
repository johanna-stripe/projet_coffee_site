//=============================IMPORTS=============================
import express from "express";

import {
    //GET
    getAllBrands,
    getBrandById,
    getProductsByBrand,
    //POST
    createABrand,
} from "../2. controllers/brandController.js";
import {deleteProduct} from "../2. controllers/productController.js";

const router = express.Router();
export default router


//===================GET========================
router.get('/', getAllBrands)

router.get('/:id', getBrandById)

router.get('/:id/products', getProductsByBrand)

//===================POST========================
router.post('/', createABrand)

//====================PUT=========================

//===================PATCH========================

//===================DELETE=======================
router.delete('/:id', deleteProduct)


