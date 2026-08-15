//=============================IMPORTS=============================
import {
    //GET
    findAllProducts,
    findProductInfoById,
    //POST
    createANewProduct,
    findCategoryByName, createCategory,
    findBrandByName, createBrand,
    //DELETE
    deleteByIdProduct,
} from "../4. models/productModel.js";


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


//=================================================================
//=================================================================
//=================================================================


//========================GET ALL PRODUCTS=========================
export const getProducts = async () => {
    const result = await findAllProducts()
    if (!result) {
        return null
    }
    return result
}

//======================GET PRODUCT INFO BY ID=====================
export const getProductInfoById = async (productId) => {

    const rows = await findProductInfoById(productId)
    //rows parce qu'on va chercher toutes les lignes info du produit

    if (!rows) {
        return null
    }

    return {
        product_id: rows.product_id,
        category_id: rows.category_id,
        brand_id: rows.brand_id,
        product_name: rows.product_name,
        product_description: rows.product_description,
        product_image_url: rows.product_image_url,
        price: rows.price,
        stock: rows.stock,
        created_at: rows.created_at,
        updated_at: rows.updated_at,
    }
}


//======================POST NEW PRODUCT==============================

//PB : l'user ne va pas rentrer un category_id ni un brand_id
//Exemple : l'user entre "café grain" il faut trouver à quel category_id ça correspond
//Solution --> lier category_id à category_name et brand_id à brand_name
//En mm temps : si category_name ou brand_name n'existe pas, on les crée


// **************************Etape 1 : catégorie/brand existe déjà ? sinon on la crée*************************
const resolveCategoryId = async (categoryName) => {
    const cleanCategoryName = normalizeText(categoryName)
    if (!cleanCategoryName) {
        throw errorBuilder('Product category is required', 400)
    }
//Avec throw, l'exécution de resolveCategoryId s'arrête immédiatement, l'erreur remonte automatiquement à travers tous les await jusqu'à ton try/catch dans le controller

    const existing = await findCategoryByName(cleanCategoryName)
    //on cherche d'abord si la catégorie existe
    if (existing) {
        return existing.category_id
        //si elle existe, on retourne directement son id existant
    }
    return await createCategory(cleanCategoryName)
    //si elle existe pas, on la crée
}

const resolveBrandId = async (brandName) => {

    const clearBrandName = normalizeText(brandName)
    if (!clearBrandName) throw errorBuilder('Product brand is required', 400)

    const existing = await findBrandByName(brandName)
    if (existing) return existing.brand_id

    return await createBrand(brandName)
}


// ***************************** Etape 2 : on crée le product ***************************
export const createNewProduct = async (productData) => {
    const {
        category_name,
        brand_name,
        product_name,
        product_description,
        product_image_url,
        price,
        stock
    } = productData
    //l'objet ici correspond à la requête body JSON envoyée à Postman
    //ici on a un objet destructuring : ça reviendrait à faire
    //const category_name = productData.category_name
    //const brand_name = productData.brand_name etc.....


    const cleanProductName = normalizeText(product_name)
    if (!cleanProductName) {
        throw errorBuilder('Product name is required', 400)
    }

    const cleanProductDescription = normalizeText(product_description)
    if (!cleanProductDescription) {
        throw errorBuilder('Product description is required', 400)
    }

    const category_id = await resolveCategoryId(category_name)

    const brand_id = await resolveBrandId(brand_name)

    const values = [
        category_id, //match la const ci-dessous pour trouver si la category existe déjà
        brand_id, //pareil avec brand
        cleanProductName,          // ← on utilise la version nettoyée
        cleanProductDescription,    // pareil
        product_image_url,
        price,
        stock
    ]
    //ici c'est les paramètres de createANewProduct :
    // INSERT INTO product
    // (category_id, brand_id, product_name, product_description, poduct_image_url, price, stock)
    //ils doivent correspondre parfaitement à la requête sql

    const results = await createANewProduct(values)

    return results
}


//======================DELETE PRODUCT=====================
export const deleteProductById = async (productId) => {
    const result = await deleteByIdProduct(productId)
    if (!result) {
        return null
    }
    return result
}
