//==============IMPORTS==================
import {
    //GET
    getBrands,
    getBrandInfoById,
    getProductsByBrandId,
    //POST
    createNewBrand,
    //PUT
    modifyByIdBrand,
    //DELETE
    deleteBrandById,
} from "../services/brandService.js";


//==================GET ALL BRANDS=====================
export const getAllBrands = async (req, res) => {
    try {
        const brands = await getBrands()
        return res.json(brands)

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}

//==================GET BRAND BY ID=====================
export const getBrandById = async (req, res) => {
    try {
        const brandId = req.params.id
        if (!brandId) {
            res.status(400).json({error: 'Brand Id is required'})
        }

        const results = await getBrandInfoById(brandId)
        if (!results) {
            return res.status(404).json({error: 'Brand does not exist'})
        }
        return res.json({
            brandId,
            message: 'Brand found successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//==================GET PRODUCTS BY BRAND ID=====================
export const getProductsByBrand = async (req, res) => {
    try {
        const brandId = req.params.id
        if (!brandId) {
            return res.status(400).json({error: 'Brand Id is required'})
        }

        const results = await getProductsByBrandId(brandId)
        if (!results) {
            return res.status(404).json({error: 'Brand does not exist'})
        }
//pas besoin de affectedRows sur des SELECT puisque ça renvoit un objet {brand_id, brand_name, product_count}
// ça n'existe que sur les résultats bruts d'INSERT/UPDATE/DELETE
        return res.json({
            brandId,
            message: 'Products found successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//==================CREATE NEW BRAND=====================
export const createABrand = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(404).json({error: 'Brand name is required'})
        }

        const results = await createNewBrand(req.body)
        if (!results || results.affectedRows === 0) {
            return res.status(404).json({error: 'Brand could not be created'})
        }
        return res.status(201).json({
            message: 'Brand created', data: {
                id: results.insertId,
                ...req.body
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//==================MODIFY BRAND BY PUT=====================
export const modifyBrand = async (req, res) => {
    try {
        const brandId = req.params.id
        if (!brandId) {
            return res.status(404).json({error: 'Brand name is required'})
        }

        const results = await modifyByIdBrand(brandId, req.body)
        if (!results || results.affectedRows === 0) {
            return res.status(404).json({error: 'Brand could not be modified'})
        }
        return res.status(201).json({
            brandId,
            message: 'Brand has been modified successfully',
            results
        })

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}


//=========================DELETE BRAND==============================
export const deleteBrand = async (req, res) => {
    try {
        const brandId = req.params.id
        if (!brandId) {
            return res.status(400).json({error: 'Product Id is required'})
        }
        const results = await deleteBrandById(brandId)
        if (!results || results.affectedRows === 0) {
            return res.status(404).json({error: 'Product does not exist'})
        }
        return res.json({
            brandId,
            message: 'Brand deleted successfully',
            results
        })

    } catch (error) {
        console.log('You have a Server error')
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}
