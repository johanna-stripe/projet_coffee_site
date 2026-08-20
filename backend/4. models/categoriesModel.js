import db from "../6. config/database.js"

import {
    //GET
    FIND_ALL_CATEGORIES,
    FIND_CATEGORY_BY_ID,
    FIND_PRODUCTS_BY_CATEGORY_ID,
    FIND_CATEGORY_PARENT_BY_ID,
    //PUT
    PUT_CATEGORY,
    //DELETE
    DELETE_CATEGORY_BY_ID,
} from "../5. constantes/categoriesDBConstantes.js";


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

//==================MODIFY CATEGORY BY PUT=====================
export const findCategoryParentById = async (parentId) => {
    const [result] = await db.query(FIND_CATEGORY_PARENT_BY_ID, [parentId])
    return result
}


export const modifyByIdCategory = async (categoryId, values) => {
    const [results] = await db.query(PUT_CATEGORY, [...values,categoryId])
    return results
}


//===================DELETE CATEGORY=======================
export const deleteCategoryById = async (categoryId) => {
    const [results] = await db.query(DELETE_CATEGORY_BY_ID, [categoryId])
    return results
}