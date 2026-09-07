//========================IMPORTS========================
import {
    //GET
    findAllCategories,
    findCategoryById,
    findProductsByCategoryId,
    //PUT
    modifyByIdCategory,
    //DELETE
    deleteCategoryById,
} from "../models/categoriesModel.js";

import {createCategory, findCategoryByName} from "../models/productModel.js";

import {
    normalizeText,
    errorBuilder
} from "../private methods/privateMethods.js";

//==================GET ALL CATEGORIES=====================
export const getCategories = async () => {
    const results = await findAllCategories()
    if (!results) throw errorBuilder('Not found', 404)
    return results
}

//==================GET CATEGORY BY ID=====================
export const getCategoryInfoById = async (categoryId) => {
    const rows = await findCategoryById(categoryId)
    if (!rows) throw errorBuilder('Not found', 404)
    return {
        category_id: rows.category_id,
        category_name: rows.category_name,
        parent_id: rows.parent_id
    }
}

//==================GET PRODUCTS BY CATEGORY ID=====================
export const getProductsByCategoryId = async (categoryId) => {
    const rows = await findProductsByCategoryId(categoryId)
    if (!rows) throw errorBuilder('Not found', 404)
    return {
        category_id: rows.category_id,
        category_name: rows.category_name,
        parent_id: rows.parent_id,
        product_count: rows.product_count
    }
}


//==================CREATE NEW CATEGORY=====================
export const createNewCategory = async (categoryData) => {
    const {category_name, parent_id} = categoryData

    const cleanCategoryName = normalizeText(category_name)
    if (!cleanCategoryName) throw errorBuilder('Category name is required', 400)

    const existing = await findCategoryByName(cleanCategoryName)
    if (existing) throw errorBuilder('Category already exists', 400)
    // return existing.category_id

    const values = [
        cleanCategoryName,
        parent_id
    ]
    return await createCategory(values)
}

//====================MODIFY CATEGORY=======================
/*
quand l'admin veut modifier une category :
1. Il choisit la category par category_id
2. Il modifier category_name
3. Il peut modifier le parent_id
 */

export const modifyCategory = async (categoryId, categoryValues) => {
    // const category_parent = await findCategoryParentById(categoryId)

    const {category_name, parent_id} = categoryValues

    const cleanCategoryName = normalizeText(category_name)
    if (!cleanCategoryName) throw errorBuilder('Product name is required', 400)

    const existing = await findCategoryByName(cleanCategoryName)
    if (existing && existing.category_id != categoryId) throw errorBuilder('Category already exists', 400)

    const values = [
        cleanCategoryName,
        parent_id
    ]

    return await modifyByIdCategory(categoryId, values)
}


//=====================DELETE CATEGORY=======================
export const deleteByIdCategory = async (categoryId) => {
    const result = await deleteCategoryById(categoryId)
    if (!result || result.affectedRows === 0) throw errorBuilder('Not found', 404)
    return result
}

