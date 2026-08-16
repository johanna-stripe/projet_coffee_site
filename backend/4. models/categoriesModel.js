import db from "../6. config/database.js"

import {
    //GET
    FIND_ALL_CATEGORIES,
    FIND_CATEGORY_BY_ID,
    FIND_PRODUCTS_BY_CATEGORY_ID,
    //DELETE
    DELETE_CATEGORY_BY_ID,
} from "../5. constantes/categoriesDBConstantes.js";
import {DELETE_PRODUCT_BY_ID} from "../5. constantes/productDBConstantes.js";


//==================GET ALL CATEGORIES=====================
export const findAllCategories = async () => {
    const [results] = await db.query(FIND_ALL_CATEGORIES)
    return results
}


//==================GET CATEGORY BY ID=====================
export const findCategoryById = async (categoryId) => {
    const [results] = await db.query(FIND_CATEGORY_BY_ID, [categoryId])
    return results[0] ?? null
}


//==================GET PRODUCTS BY CATEGORY ID=====================
export const findProductsByCategoryId = async (categoryId) => {
    const [results] = await db.query(FIND_PRODUCTS_BY_CATEGORY_ID, [categoryId])
    return results[0] ?? null
}


//===================DELETE CATEGORY=======================

export const deleteCategoryById = async (categoryId) => {
    const [results] = await db.query(DELETE_CATEGORY_BY_ID, [categoryId])
    return results
}