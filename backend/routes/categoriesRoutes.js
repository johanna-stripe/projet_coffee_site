//==============IMPORTS==================
import express from "express";

import {
    //GET
    getAllCategories,
    getCategoryById,
    getProductsByCategory,
    //POST
    createACategory,
    //PUT
    putCategory,
    //DELETE
    deleteCategory,
} from '../controllers/categoriesController.js'


const router = express.Router();
// on utiliser .Router pour pouvoir passer d'un fichier à l'autre en MVC
// on aurait utilisé juste app = express() si on était en monolitique
export default router


// ==================CRUD OPERATIONS===================

//===================GET========================
//Lister toutes les catégories
router.get('/', getAllCategories)

//Liste une categorie précise
router.get('/:id', getCategoryById)

// Lister les produits d'une categorie
router.get('/:id/products', getProductsByCategory)

//===================POST========================
router.post('/', createACategory)
//ajouter le category_parent

//===================PUT=========================
router.put('/:id',putCategory)

//===================DELETE=======================
router.delete('/:id', deleteCategory)
