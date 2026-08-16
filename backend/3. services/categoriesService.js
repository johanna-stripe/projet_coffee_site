//========================IMPORTS========================
import {
    //GET
    findAllCategories,
    findCategoryById,
    findProductsByCategoryId,
    //DELETE
    deleteCategoryById,
} from "../4. models/categoriesModel.js";

import {createCategory, findCategoryByName} from "../4. models/productModel.js";

//======================PRIVATE METHODS============================
const normalizeText = (text) => {
    if (typeof text !== "string") {
        return ""
    }
    return text.trim().toLowerCase()
}

//Générer des erreurs personnalisées
const errorBuilder = (message, statusCode = 400) => {
    //message : le message personnalisé
    //statusCode = 400 : par défaut
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

//==================GET ALL CATEGORIES=====================
export const getCategories = async () => {
    const result = await findAllCategories()
    if (!result) {
        return null
    }
    return result
}


//==================GET CATEGORY BY ID=====================
export const getCategoryInfoById = async (categoryId) => {
    const rows = await findCategoryById(categoryId)

    if (!rows) {
        return null
    }

    return {
        category_id: rows.category_id,
        category_name: rows.category_name,
        parent_id: rows.parent_id
    }
}


//==================GET PRODUCTS BY CATEGORY ID=====================
export const getProductsByCategoryId = async (categoryId) => {
    const rows = await findProductsByCategoryId(categoryId)

    if (!rows) {
        return null
    }

    return {
        category_id: rows.category_id,
        category_name: rows.category_name,
        parent_id: rows.parent_id,
        product_count: rows.product_count
    }

}


//==================CREATE NEW CATEGORY=====================
export const createNewCategory = async (categoryData) => {
    const category_name = categoryData.category_name

    const cleanCategoryName = normalizeText(category_name)
    if (!cleanCategoryName) throw errorBuilder('Category name is required', 400)

    const existing = await findCategoryByName(cleanCategoryName)
    if (existing) throw errorBuilder('Category already exists', 400)
    // return existing.category_id

    return await createCategory(cleanCategoryName)
}


//====================DELETE CATEGORY=======================

export const deleteByIdCategory = async (categoryId) => {
    const results = await deleteCategoryById(categoryId)
    if (!results || results.affectedRows === 0) {
        return null
    }
    return results
}

