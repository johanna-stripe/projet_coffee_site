//========================IMPORTS========================
import {
    //GET
    findAllCategories,
    findCategoryById,
    findProductsByCategoryId,
    findCategoryParentById,
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


//==================PARENT D'UNE CATEGORIE=====================
// Le site a 2 niveaux : catégorie principale (Café en grain, Thé…) et sous-catégorie.
// Le parent doit donc exister et être lui-même une catégorie principale (ça évite aussi les boucles).
const resolveParentId = async (parentId, categoryId = null) => {
    if (parentId === undefined || parentId === null || parentId === '') return null

    const id = Number(parentId)
    if (!Number.isInteger(id) || id <= 0) throw errorBuilder('Invalid parent category', 400)
    if (categoryId !== null && id === Number(categoryId)) throw errorBuilder('A category cannot be its own parent', 400)

    const parent = await findCategoryById(id)
    if (!parent) throw errorBuilder('Parent category not found', 400)
    if (parent.parent_id !== null) throw errorBuilder('The parent must be a main category', 400)
    return id
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
        await resolveParentId(parent_id)
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

    const current = await findCategoryById(categoryId)
    if (!current) throw errorBuilder('Not found', 404)

    const newParentId = await resolveParentId(parent_id, categoryId)

    // une catégorie qui a des sous-catégories ne peut pas devenir elle-même une sous-catégorie
    if (newParentId !== null) {
        const children = await findCategoryParentById(categoryId)
        if (children.length > 0) throw errorBuilder('A category with sub-categories cannot become a sub-category', 400)
    }

    return await modifyByIdCategory(categoryId, [cleanCategoryName, newParentId])
}


//=====================DELETE CATEGORY=======================
export const deleteByIdCategory = async (categoryId) => {
    const category = await findProductsByCategoryId(categoryId)
    if (!category) throw errorBuilder('Not found', 404)

    // suppression refusée tant que la catégorie contient des produits ou des sous-catégories
    if (category.product_count > 0) throw errorBuilder('This category still contains products and cannot be deleted', 409)
    const children = await findCategoryParentById(categoryId)
    if (children.length > 0) throw errorBuilder('This category still has sub-categories and cannot be deleted', 409)

    const result = await deleteCategoryById(categoryId)
    if (!result || result.affectedRows === 0) throw errorBuilder('Not found', 404)
    return result
}

