//==============IMPORTS==================
import db from "../config/database.js"

import {
    //GET
    FIND_ALL_BRANDS,
    FIND_BRAND_BY_ID,
    GET_BRAND_PRODUCTS_COUNT,
    //PUT
    PUT_BRAND,
    //DELETE
    DELETE_BRAND_BY_ID
} from "../constantes/brandDBConstantes.js";


//==================GET BRAND BY ID=====================
export const findAllBrands = async () => {
    const [results] = await db.query(FIND_ALL_BRANDS)
    return results
}

//==================GET BRAND BY ID=====================
export const findBrandById = async (brandId) => {
    const [results] = await db.query(FIND_BRAND_BY_ID, [brandId])
    return results [0] ?? null
}

//==================GET PRODUCTS BY BRAND ID=====================
export const getBrandProductCount = async (brandId) => {
    const [results] = await db.query(GET_BRAND_PRODUCTS_COUNT, [brandId])
    return results [0] ?? null
}


//==================CREATE NEW BRAND=====================
//export const createBrand and findBrandByName are in productModel


//==================MODIFY BRAND BY PUT=====================
export const modifyBrandById = async (brandId, brandName) => {
    const values = [brandName, brandId]
    const [results] = await db.query(PUT_BRAND, values)
    return results
}


//==================DELETE BRAND=====================
export const deleteByIdBrand = async (brandId) => {
    const [results] = await db.query(DELETE_BRAND_BY_ID, [brandId])
    return results
}