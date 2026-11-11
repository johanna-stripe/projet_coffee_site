//==============IMPORTS==================
import {
    //POST
    findAllBrands,
    findBrandById,
    getBrandProductCount,
    //PUT
    modifyBrandById,
    //DELETE
    deleteByIdBrand,
} from "../models/brandModel.js";

import {createBrand, findBrandByName} from "../models/productModel.js";

import {
    normalizeText,
    errorBuilder
} from "../private methods/privateMethods.js";


//==================GET ALL BRANDS=====================
export const getBrands = async () => {
    const results = await findAllBrands()

    if (!results || results.length === 0) throw errorBuilder('Not found', 404)
    return results
}

//==================GET BRAND BY ID=====================
export const getBrandInfoById = async (brandId) => {
    const brand = await findBrandById(brandId)
    if (!brand) throw errorBuilder('Not found', 404)
//va nous retourner une seule ligne : un objet (la marque recherchée)
    return {
        brand_id: brand.brand_id,
        brand_name: brand.brand_name
    }
}

//==================GET PRODUCTS BY BRAND ID=====================
export const getProductsByBrandId = async (brandId) => {
    const brand = await getBrandProductCount(brandId)
    if (!brand) throw errorBuilder('Not found',404)
    return {
        brand_id: brand.brand_id,
        brand_name: brand.brand_name,
        product_count: brand.product_count
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
export const modifyByIdBrand = async (brandId, brandData) => {
    const brand_name = brandData.brand_name

    const cleanBrandName = normalizeText(brand_name)
    if (!cleanBrandName) throw errorBuilder('Brand name is required', 400)

    const existing = await findBrandByName(cleanBrandName)
    if (existing && existing.brand_id != brandId) throw errorBuilder('Brand already exists', 400)
/*
Cette condition est vraie seulement si un nom identique existe déjà en base et qu'il appartient à une marque différente de celle que qu'on modifie
— donc elle bloque le renommage uniquement en cas de vrai conflit, pas quand tu re-sauvegardes la marque avec son propre nom.
Exemple : brand_name: "Leclerc" - si je relance avec Leclerc écrit pareil il va pas me dire brand already exists. Par contre si Leclerc existait ailleurs, là oui.
 */
    return await modifyBrandById(brandId, cleanBrandName)
}


//==================DELETE BRAND=====================
export const deleteBrandById = async (brandId) => {
    const brand = await getBrandProductCount(brandId)
    if (!brand) throw errorBuilder('Not found', 404)

    // suppression refusée tant que des produits sont rattachés à la marque
    if (brand.product_count > 0) throw errorBuilder('This brand still has products and cannot be deleted', 409)

    const result = await deleteByIdBrand(brandId)
    if (!result) throw errorBuilder('Not found',404)
    return result
}

