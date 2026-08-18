//=============================IMPORTS=============================
import {
    //GET
    findAllProducts,
    findProductInfoById,
    //POST
    createANewProduct,
    findCategoryByName, createCategory,
    findBrandByName, createBrand,
    createCoffeeTeaInfusionDetails,
    createMachineDetails,
    createAccessoryDetails,
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

    const baseProduct = {
        product_id: rows.product_id,
        category_id: rows.category_id,
        brand_id: rows.brand_id,
        product_name: rows.product_name,
        product_description: rows.product_description,
        price: rows.price,
        stock: rows.stock,
    }

    if (rows.origin !== null) {
        //c'est un coffee/tea/infusions
        return {
            ...baseProduct,
            origin: rows.origin,
            roast: rows.roast,
            intensity: rows.intensity,
            weight: rows.weight
        }
    }

    if (rows.pressure_power !== null) {
        //c'est une machine
        return {
            ...baseProduct,
            pressure_power: rows.pressure_power,
            tank_capacity: rows.tank_capacity,
            grinder: rows.grinder
        }
    }

    if (rows.material !== null) {
        //c'est un accessoire
        return {
            ...baseProduct,
            material: rows.material,
            capacity: rows.capacity,
            color: rows.color,
        }
    } else {
        throw errorBuilder(`Product ${productId} has no matching subtype in COFFEE_TEA, COFFEE_MAKER or ACCESSORIES`, 500)
    }
}


//=========================POST NEW PRODUCT==============================

//PB : l'user ne va pas rentrer un category_id ni un brand_id
//Exemple : l'user entre "café grain" il faut trouver à quel category_id ça correspond
//Solution --> lier category_id à category_name et brand_id à brand_name
//En mm temps : si category_name ou brand_name n'existe pas, on les crée


// **************************Etape 1 : catégorie/brand existe déjà ? sinon on la crée*************************
const resolveCategoryId = async (categoryId, categoryName) => {
    // Cas 1 : le front a choisi une catégorie existante dans la liste déroulante
    if (categoryId) {
        return categoryId
    }

    // Cas 2 : le front veut créer une nouvelle catégorie à la volée
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

const resolveBrandId = async (brandId, brandName) => {
    if (brandId) {
        return brandId
    }
    const clearBrandName = normalizeText(brandName)
    if (!clearBrandName) {
        return null
    }

    const existing = await findBrandByName(clearBrandName)
    if (existing) return existing.brand_id

    return await createBrand(clearBrandName)
}


// ***************************** Etape 2 : on crée le product ***************************
export const createNewProduct = async (productData) => {
    const {
        product_name,
        product_description,
        product_image_url,
        price,
        stock,
        product_type,
        origin,
        roast,
        intensity,
        weight,
        pressure_power,
        tank_capacity,
        grinder,
        material,
        capacity,
        color
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

    const category_id = await resolveCategoryId(productData.category_id, productData.category_name)

    const brand_id = await resolveBrandId(productData.brand_id, productData.brand_name)

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

    // Étape A : on insère dans PRODUCT
    const productResult = await createANewProduct(values)
    const newProductId = productResult.insertId

    // Étape B : maintenant qu'on a le product_id, on insère dans la bonne sous-table
    if (product_type === 'coffee/tea/infusion') {
        await createCoffeeTeaInfusionDetails(newProductId, {origin, roast, intensity, weight})
    } else if (product_type === 'machine') {
        await createMachineDetails(newProductId, {pressure_power, tank_capacity, grinder})
    } else if (product_type === 'accessory') {
        await createAccessoryDetails(newProductId, {material, capacity, color})
    } else {
        throw errorBuilder('Wrong product_type', 400)
    }
    return productResult
}


//======================DELETE PRODUCT=====================
export const deleteProductById = async (productId) => {
    const result = await deleteByIdProduct(productId)
    if (!result) {
        return null
    }
    return result
}
