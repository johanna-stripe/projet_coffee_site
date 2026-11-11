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
    //PUT
    modifyProductWithDetails,
    //PATCH
    modifyByPatchProduct,
    //DELETE
    deleteByIdProduct,
} from "../models/productModel.js";

import {
    normalizeText,
    errorBuilder
} from "../private methods/privateMethods.js";


//========================GET ALL PRODUCTS=========================
export const getProducts = async () => {
    const result = await findAllProducts()
    if (!result) throw errorBuilder('Not found', 404)
    return result
}

//======================GET PRODUCT INFO BY ID=====================
export const getProductInfoById = async (productId) => {
    const rows = await findProductInfoById(productId)
    //rows parce qu'on va chercher toutes les lignes info du produit
    if (!rows) throw errorBuilder('Not found', 404)

    const baseProduct = {
        product_id: rows.product_id,
        category_id: rows.category_id,
        brand_id: rows.brand_id,
        product_name: rows.product_name,
        product_description: rows.product_description,
        product_image_url: rows.product_image_url,
        category_name: rows.category_name,
        brand_name: rows.brand_name,
        price: rows.price,
        stock: rows.stock,
    }

    if (rows.origin !== null) {
        //c'est un coffee/tea/infusions
        return {
            ...baseProduct,
            product_type: 'coffee/tea/infusion',
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
            product_type: 'machine',
            pressure_power: rows.pressure_power,
            tank_capacity: rows.tank_capacity,
            grinder: rows.grinder
        }
    }

    if (rows.material !== null) {
        //c'est un accessoire
        return {
            ...baseProduct,
            product_type: 'accessory',
            material: rows.material,
            capacity: rows.capacity,
            color: rows.color,
        }
    } else {
        throw errorBuilder(`Product ${productId} has no matching subtype in COFFEE_TEA, COFFEE_MAKER or ACCESSORIES`, 500)
    }
}


//=========================VALIDATION PRODUIT==============================
// Utilisée par la création ET la modification : mêmes règles aux deux endroits
const NAME_MAX = 150
const DESCRIPTION_MAX = 2000
const URL_MAX = 500

const toNumber = (value) => (value === '' || value === null || value === undefined) ? NaN : Number(value)

// Renvoie les champs communs nettoyés, ou lève une erreur 400 claire
const validateProductFields = (data) => {
    const name = typeof data.product_name === 'string' ? data.product_name.trim() : ''
    if (!name) throw errorBuilder('Product name is required', 400)
    if (name.length > NAME_MAX) throw errorBuilder(`Product name must be at most ${NAME_MAX} characters`, 400)

    const description = typeof data.product_description === 'string' ? data.product_description.trim() : ''
    if (!description) throw errorBuilder('Product description is required', 400)
    if (description.length > DESCRIPTION_MAX) throw errorBuilder(`Product description must be at most ${DESCRIPTION_MAX} characters`, 400)

    const imageUrl = typeof data.product_image_url === 'string' ? data.product_image_url.trim() : ''
    if (imageUrl.length > URL_MAX) throw errorBuilder('Image URL is too long', 400)
    // une image est affichée dans <img src> : on n'accepte qu'un chemin du site ou une adresse http(s)
    if (imageUrl && !/^(\/|https?:\/\/)/i.test(imageUrl)) throw errorBuilder('Image URL must start with / or http(s)://', 400)

    const price = toNumber(data.price)
    if (!Number.isFinite(price) || price < 0) throw errorBuilder('Price must be a number >= 0', 400)

    const stock = toNumber(data.stock)
    if (!Number.isInteger(stock) || stock < 0) throw errorBuilder('Stock must be a whole number >= 0', 400)

    return {name, description, imageUrl: imageUrl || null, price, stock}
}

// Champs propres à chaque type de produit (colonnes des sous-tables)
const cleanText = (value) => (typeof value === 'string' && value.trim() !== '') ? value.trim() : null
const cleanNumber = (value, label) => {
    if (value === '' || value === null || value === undefined) return null
    const number = Number(value)
    if (!Number.isFinite(number) || number < 0) throw errorBuilder(`${label} must be a number >= 0`, 400)
    return number
}

const cleanDetails = (productType, data) => {
    if (productType === 'coffee/tea/infusion') {
        return {
            origin: cleanText(data.origin),
            roast: cleanText(data.roast),
            intensity: cleanNumber(data.intensity, 'Intensity'),
            weight: cleanNumber(data.weight, 'Weight')
        }
    }
    if (productType === 'machine') {
        return {
            pressure_power: cleanText(data.pressure_power),
            tank_capacity: cleanNumber(data.tank_capacity, 'Tank capacity'),
            grinder: cleanText(data.grinder)
        }
    }
    if (productType === 'accessory') {
        return {
            material: cleanText(data.material),
            capacity: cleanNumber(data.capacity, 'Capacity'),
            color: cleanText(data.color)
        }
    }
    throw errorBuilder('Wrong product_type', 400)
}

//=========================POST NEW PRODUCT==============================
/*
PB : l'user ne va pas rentrer un category_id ni un brand_id
Exemple : l'user entre "café grain" il faut trouver à quel category_id ça correspond
Solution --> lier category_id à category_name et brand_id à brand_name
En mm temps : si category_name ou brand_name n'existe pas, on les crée
 */

// **************************Etape 1 : catégorie/brand existe déjà ? sinon on la crée*************************
const resolveCategoryId = async (categoryId, categoryName) => {
    // Cas 1 : le front a choisi une catégorie existante dans la liste déroulante
    if (categoryId) return categoryId

    // Cas 2 : le front veut créer une nouvelle catégorie à la volée
    const cleanCategoryName = normalizeText(categoryName)
    if (!cleanCategoryName) throw errorBuilder('Product category is required', 400)
    //Avec throw, l'exécution de resolveCategoryId s'arrête immédiatement, l'erreur remonte automatiquement à travers tous les await jusqu'à ton try/catch dans le controller

    const existing = await findCategoryByName(cleanCategoryName)
    //on cherche d'abord si la catégorie existe
    if (existing) return existing.category_id
    //si elle existe, on retourne directement son id existant

    return await createCategory([cleanCategoryName, null])
    //si elle existe pas, on la crée
}

const resolveBrandId = async (brandId, brandName) => {
    if (brandId) return brandId

    const clearBrandName = normalizeText(brandName)
    if (!clearBrandName) throw errorBuilder('Not found', 404)

    const existing = await findBrandByName(clearBrandName)
    if (existing) return existing.brand_id

    return await createBrand(clearBrandName)
}


// ***************************** Etape 2 : on crée le product ***************************
export const createNewProduct = async (productData) => {
    const {product_type} = productData

    const fields = validateProductFields(productData)
    const details = cleanDetails(product_type, productData)
    // (le type est vérifié par cleanDetails avant toute écriture en base)

    const category_id = await resolveCategoryId(productData.category_id, productData.category_name)

    const brand_id = productData.brand_id || productData.brand_name
        ? await resolveBrandId(productData.brand_id, productData.brand_name)
        : null
    // la marque est facultative (LEFT JOIN dans les requêtes)

    const values = [
        category_id,
        brand_id,
        fields.name,
        fields.description,
        fields.imageUrl,
        fields.price,
        fields.stock
    ]
    /*
    ici c'est les paramètres de createANewProduct :
    INSERT INTO product
    (category_id, brand_id, product_name, product_description, product_image_url, price, stock)
    ils doivent correspondre parfaitement à la requête sql
   */

    // Étape A : on insère dans PRODUCT
    const productResult = await createANewProduct(values)
    const newProductId = productResult.insertId

    // Étape B : maintenant qu'on a le product_id, on insère dans la bonne sous-table
    if (product_type === 'coffee/tea/infusion') {
        await createCoffeeTeaInfusionDetails(newProductId, details)
    } else if (product_type === 'machine') {
        await createMachineDetails(newProductId, details)
    } else {
        await createAccessoryDetails(newProductId, details)
    }
    return productResult
}


//======================PUT PRODUCT=====================
export const modifyProductByPut = async (productId, productValues) => {
    // le type (café / machine / accessoire) ne se change pas : on le relit en base
    const existing = await getProductInfoById(productId)

    const fields = validateProductFields(productValues)
    const details = cleanDetails(existing.product_type, productValues)

    const category_id = Number(productValues.category_id)
    if (!Number.isInteger(category_id) || category_id <= 0) throw errorBuilder('Product category is required', 400)

    // marque facultative : vide = pas de marque
    const brand_id = productValues.brand_id ? Number(productValues.brand_id) : null
    if (brand_id !== null && (!Number.isInteger(brand_id) || brand_id <= 0)) throw errorBuilder('Invalid brand', 400)

    const values = [
        category_id,
        brand_id,
        fields.name,
        fields.description,
        fields.imageUrl,
        fields.price,
        fields.stock
    ]

    return await modifyProductWithDetails(productId, values, existing.product_type, details)
}

//==========================PATCH PRODUCT============================
export const modifyProductByPatch = async (productId, changes) => { //changes : les champs à mettre à jour
    const allowed_updates = ['category_id', 'brand_id', 'product_name', 'product_description', 'product_image_url', 'price', 'stock']
    const fields_to_update = [] //noms de colonnes à modifier
    const values_to_update = [] //valeurs correspondantes

    allowed_updates.forEach((field) => { //on parcours chaque champ authorisé
        if (changes[field] !== undefined) { //si ce champ (field) est bien présent dans 'changes'
            //Si une première valeur a été entré, donc pas undefined
            fields_to_update.push(field);
            // ajoute le nom du champ à modifier
            values_to_update.push(changes[field])
            //ajoute sa nouvelle valeur
        }
    })
    if (fields_to_update.length === 0) throw errorBuilder('No field to update', 400)

    // mêmes règles que pour la création sur les champs modifiés
    if (changes.price !== undefined && !(toNumber(changes.price) >= 0)) throw errorBuilder('Price must be a number >= 0', 400)
    if (changes.stock !== undefined && !(Number.isInteger(toNumber(changes.stock)) && toNumber(changes.stock) >= 0)) throw errorBuilder('Stock must be a whole number >= 0', 400)
    if (changes.product_name !== undefined && (typeof changes.product_name !== 'string' || !changes.product_name.trim())) throw errorBuilder('Product name is required', 400)

    values_to_update.push(productId) //On ajoute productId à la fin du tableau des valeurs pour l'utiliser dans la clause WHERE id = ?

    return await modifyByPatchProduct(fields_to_update, values_to_update)
}


//======================DELETE PRODUCT=====================
export const deleteProductById = async (productId) => {
    try {
        return await deleteByIdProduct(productId)
    } catch (error) {
        // 1451 = clé étrangère : le produit figure dans une commande passée (order_item)
        if (error.errno === 1451) {
            throw errorBuilder('This product is part of past orders and cannot be deleted. Set its stock to 0 instead.', 409)
        }
        throw error
    }
}
