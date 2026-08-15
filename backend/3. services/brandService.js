//==============IMPORTS==================
import {
    findAllBrands,
    findBrandById,
    findProductsByBrandId,
    //DELETE
    // deleteBrandById,
} from "../4. models/brandModel.js";

import {createBrand, findBrandByName} from "../4. models/productModel.js";


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


//==================GET BRAND BY ID=====================
export const getBrands = async () => {
    const result = await findAllBrands()

    if (!result) {
        return null
    }
    return result
}

//==================GET BRAND BY ID=====================
export const getBrandInfoById = async (brandId) => {
    const rows = await findBrandById(brandId)
    if (!rows) {
        return null
    }

    return {
        brand_id: rows.brand_id,
        brand_name: rows.brand_name
    }
}

//==================GET PRODUCTS BY BRAND ID=====================
export const getProductsByBrandId = async (brandId) => {
    const rows = await findProductsByBrandId(brandId)
    if (!rows) {
        return null
    }

    return {
        brand_id: rows.brand_id,
        brand_name: rows.brand_name,
        product_count: rows.product_count
    }
}


//==================CREATE NEW BRAND=====================
export const createNewBrand = async (brandData) => {
    const brand_name = brandData.brand_name

    const cleanBrandName = normalizeText(brand_name)
    if (!cleanBrandName) throw errorBuilder('Brand name is required', 400)

    const existing = await findBrandByName(cleanBrandName)
    if (existing) throw errorBuilder('Brand already exists', 400)
    // return existing.brand_id

    const results = await createBrand(cleanBrandName)
    return results
}







