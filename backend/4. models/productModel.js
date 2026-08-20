//=============================IMPORTS=============================
import db from "../6. config/database.js"

import {
    //GET
    FIND_ALL_PRODUCTS,
    FIND_PRODUCT_FULL_INFO_BY_ID,
    GET_CATEGORY_BY_NAME, GET_BRAND_BY_NAME,
    //POST
    CREATE_NEW_PRODUCT, CREATE_CATEGORY, CREATE_BRAND,
    CREATE_NEW_PRODUCT_COFFEE_TEA_INFUSION,
    CREATE_NEW_MACHINE,
    CREATE_NEW_ACCESSORY,
    //PUT
    PUT_PRODUCT,
    //DELETE
    DELETE_PRODUCT_BY_ID,
} from "../5. constantes/productDBConstantes.js";

//======================Remarques utiles=========================

// Pour un SELECT → premierÉlément est un tableau de lignes trouvées (0, 1 ou plusieurs objets)
// --> Donc rows → quand tu fais un SELECT et que tu manipules un tableau de lignes

// Pour un INSERT/UPDATE/DELETE → premierÉlément est un objet unique avec des métadonnées (insertId, affectedRows, etc.)
// --> Donc results → quand tu fais un INSERT/UPDATE/DELETE et que tu manipules un objet de métadonnées


//========================GET ALL PRODUCTS=========================
export const findAllProducts = async () => {
    const [rows] = await db.query(FIND_ALL_PRODUCTS)
    return rows
}

//======================GET PRODUCT INFO BY ID=====================
export const findProductInfoById = async (productId) => {
    const [rows] = await db.query(FIND_PRODUCT_FULL_INFO_BY_ID, [productId])
    return rows[0] ?? null
    //si valeur de gauche est vraie prend là, sinon prend celle de droite
    //db.query retourne un tableau results, 2 cas sont possibles :
    // 1. la requête trouve le produit, donc result[0]
    // 2. la requête ne trouve pas le productId donc null
}


//======================POST NEW PRODUCT==============================
export const createANewProduct = async (values) => {
    const [results] = await db.query(CREATE_NEW_PRODUCT, values)
    return results
}

export const findCategoryByName = async (categoryName) => {
    const [rows] = await db.query(GET_CATEGORY_BY_NAME, [categoryName])
    return rows[0]
}

export const createCategory = async (values) => {
    const [results] = await db.query(CREATE_CATEGORY, values)
    return results.insertId
}

export const findBrandByName = async (brandName) => {
    const [rows] = await db.query(GET_BRAND_BY_NAME, [brandName])
    return rows[0]
}

export const createBrand = async (brandName) => {
    const [results] = await db.query(CREATE_BRAND, [brandName])
    return results.insertId
}

export const createCoffeeTeaInfusionDetails = async (productId, details) => {
    const {origin, roast, intensity, weight} = details
    const values = [productId, origin, roast, intensity, weight]
    const [results] = await db.query(CREATE_NEW_PRODUCT_COFFEE_TEA_INFUSION, values)
    return results
}

export const createMachineDetails = async (productId, details) => {
    const {pressure_power, tank_capacity, grinder} = details
    const values = [productId, pressure_power, tank_capacity, grinder]
    const [results] = await db.query(CREATE_NEW_MACHINE, values)
    return results
}

export const createAccessoryDetails = async (productId, details) => {
    const {material, capacity, color} = details
    const values = [productId, material, capacity, color]
    const [results] = await db.query(CREATE_NEW_ACCESSORY, values)
    return results
}

//======================PUT PRODUCT==============================
export const modifyByPutProduct = async (productId, values) =>{
    const [results] = await db.query(PUT_PRODUCT,[...values, productId])
    return results
}


//======================DELETE PRODUCT==============================
export const deleteByIdProduct = async (productId) => {
    const [results] = await db.query(DELETE_PRODUCT_BY_ID, [productId])
    return results
}