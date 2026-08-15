//=============================IMPORTS=============================
import db from "../6. config/database.js"

import {
    //GET
    FIND_ALL_PRODUCTS,
    FIND_PRODUCT_FULL_INFO_BY_ID,
    //POST
    CREATE_NEW_PRODUCT, CREATE_CATEGORY, CREATE_BRAND,
    GET_CATEGORY_BY_NAME, GET_BRAND_BY_NAME,
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

export const createCategory = async (categoryName) => {
    const [results] = await db.query(CREATE_CATEGORY, [categoryName])
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


//======================DELETE PRODUCT==============================
export const deleteByIdProduct = async (productId) => {
    const [results] = await db.query(DELETE_PRODUCT_BY_ID, [productId])
    return results[0] ?? null
}