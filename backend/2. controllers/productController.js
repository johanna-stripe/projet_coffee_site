//=============================IMPORTS=============================
import {
    //GET
    getProducts,
    getProductInfoById,
    //POST
    createNewProduct,
    //DELETE
    deleteProductById
} from "../3. services/productService.js";


//========================GET ALL PRODUCTS========================
export const getAllProducts = async (req, res) => {
    try {
        const products = await getProducts() // pas de paramètres vu qu'on veut tous les produits
        return res.json(products)

    } catch (error) {
        console.log('You have a Server error')
        return res.status(500).json({message: 'Internal server error'})
    }
}


//======================GET PRODUCT INFO BY ID======================
export const getFullInfoFromProducts = async (req, res) => {
    try {
        const productId = req.params.id //on stock l'id que l'user a entré dans une const (depuis le params, pas le body)

        if (!productId) {
            res.status(400).json({error: 'Product Id is required'})
        }
        const results = await getProductInfoById(productId) // on passe le productId en paramètre
        if (!results || results.affectedRows === 0) {
            return res.status(400).json({error: 'Product could not be found'})
        }
        return res.json({
            productId,
            message: 'Product found successfully',
            results
        })

    } catch (error) {
        console.log('You have a Server error')
        return res.status(500).json({message: 'Internal server error'})
    }
}

//=========================POST NEW PRODUCT==============================
export const createProduct = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(404).json({error: 'Product data is required'})
        }

        const results = await createNewProduct(req.body)
        if (!results || results.affectedRows === 0) {
            return res.status(400).json({error: 'Product could not be created'})
        }

        return res.status(201).json({
            message: 'Product created successfully',
            data: {
                id: results.insertId,
                ...req.body
            }
        })

    } catch (error) {
        console.log(error)
        res.status(error.statusCode || 500).json({error: error.message || 'Internal Server error'})
    }
}

//=========================DELETE PRODUCT==============================
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(400).json({error: 'Product Id is required'})
        }
        const results = await deleteProductById(productId)
        if (!results || results.affectedRows === 0) {
            return res.status(400).json({error: 'Product does not exist'})
        }
        return res.json({
            message: 'Product deleted successfully :',
            results
        })

    } catch (error) {
        console.log('You have a Server error')
        return res.status(500).json({message: 'Internal server error'})
    }
}




