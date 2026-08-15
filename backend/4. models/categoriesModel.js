import db from "../6. config/database.js"

import {
    FIND_ALL_CATEGORIES,
    FIND_CATEGORY_BY_ID,
    FIND_PRODUCTS_BY_CATEGORY_ID
} from "../5. constantes/categoriesDBConstantes.js";


//==================GET ALL CATEGORIES=====================
export const findAllCategories = async () => {
    const [results] = await db.query(FIND_ALL_CATEGORIES)
    return results
}


//==================GET CATEGORY BY ID=====================
export const findCategoryById = async(categoryId)=>{
    const [results] = await db.query(FIND_CATEGORY_BY_ID, [categoryId])
    return results[0] ?? null
}


//==================GET PRODUCTS BY CATEGORY ID=====================
export const findProductsByCategoryId = async (categoryId)=>{
    const [results] = await db.query(FIND_PRODUCTS_BY_CATEGORY_ID, [categoryId])
    return results[0] ?? null
}