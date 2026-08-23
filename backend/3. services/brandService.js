//==============IMPORTS==================
import {
    //POST
    findAllBrands,
    findBrandById,
    findProductsByBrandId,
    //PUT
    modifyBrandById,
    //DELETE
    deleteByIdBrand,
} from "../4. models/brandModel.js";

import {createBrand, findBrandByName} from "../4. models/productModel.js";

import{
    normalizeText,
    errorBuilder
} from "../7. private methods/privateMethods.js";


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

    return await createBrand(cleanBrandName)
}


//==================MODIFY BRAND BY PUT=====================
export const modifyByIdBrand = async (brandId, brandValues) => {
    const brand_name = brandValues.brand_name

    const cleanBrandName = normalizeText(brand_name)
    if (!cleanBrandName) throw errorBuilder('Brand name is required', 400)

    const existing = await findBrandByName(cleanBrandName)
    if (existing && existing.brand_id != brandId) throw errorBuilder('Brand already exists', 400)
// Cette condition est vraie seulement si un nom identique existe déjà en base et qu'il appartient à une marque différente de celle que qu'on modifie
// — donc elle bloque le renommage uniquement en cas de vrai conflit, pas quand tu re-sauvegardes la marque avec son propre nom.
// Exemple : brand_name: "Leclerc" - si je relance avec Leclerc écrit pareil il va pas me dire brand already exists. Par contre si Leclerc existait ailleurs, là oui.
    return await modifyBrandById(brandId, cleanBrandName)
}


//==================DELETE BRAND=====================
export const deleteBrandById = async (brandId) => {
    const result = await deleteByIdBrand(brandId)
    if (!result) {
        return null
    }
    return result
}




