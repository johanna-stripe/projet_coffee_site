//==============IMPORTS==================
import db from "../6. config/database.js"

import {
    //GET
    FIND_ALL_BRANDS,
    FIND_BRAND_BY_ID,
    FIND_PRODUCTS_BY_BRAND_ID,
    //DELETE
    DELETE_BRAND_BY_ID
} from "../5. constantes/brandDBConstantes.js";


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
export const findProductsByBrandId = async (brandId) => {
    const [results] = await db.query(FIND_PRODUCTS_BY_BRAND_ID, [brandId])
    return results [0] ?? null
}


//==================CREATE NEW BRAND=====================
//export const createBrand and findBrandByName are in productModel



//==================DELETE BRAND=====================
export const deleteByIdBrand = async (brandId)=>{
    const [results] = await db.query(DELETE_BRAND_BY_ID,[brandId])
    return results
}