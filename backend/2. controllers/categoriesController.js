//==================IMPORTS=====================
import {
    //GET
    getCategories,
    getCategoryInfoById,
    getProductsByCategoryId,
    //POST
    createNewCategory
} from '../3. services/categoriesService.js'

//==================GET ALL CATEGORIES=====================
export const getAllCategories = async (req, res) => {
    try {
        const categories = await getCategories()
        return res.json(categories)

    } catch (error) {
        console.log('You have a Server error')
        return res.status(500).json({message: 'Internal server error'})
    }
}


//==================GET CATEGORY BY ID=====================
export const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.id
        if (!categoryId) {
            res.status(400).json({error: 'Category Id is required'})
        }
        const results = await getCategoryInfoById(categoryId)
        if (!results || results.affectedRows === 0) {
            return res.status(400).json({error: 'Category could not be found'})
        }

        return res.json({
            categoryId,
            message: 'Category found successfully',
            results
        })

    } catch (error) {
        console.log('You have a Server error')
        return res.status(500).json({message: 'Internal server error'})
    }
}


//==================GET PRODUCTS BY CATEGORY ID=====================
export const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        if (!categoryId) {
            res.status(400).json({error: 'Category Id is required'})
        }
        const results = await getProductsByCategoryId(categoryId)
        if (!results || results.affectedRows === 0) {
            return res.status(400).json({error: 'Category could not be found'})
        }

        return res.json({
            categoryId,
            message: 'Products found successfully',
            results
        })

    } catch (error) {
        console.log('You have a Server error')
        return res.status(500).json({message: 'Internal server error'})
    }
}



//==================CREATE NEW CATEGORY=====================
export const createACategory = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(404).json({error: 'Category name is required'})
        }

        const results = await createNewCategory(req.body)
        if (!results || results.affectedRows === 0) {
            return res.status(400).json({error: 'Category could not be created'})
        }
        return res.status(201).json({
            message: 'Category created successfully', data: {
                id: results.insertId,
                ...req.body
            }
        })

    } catch (error) {
        console.log(error)
        res.status(error.statusCode || 500).json({error: error.message || 'Internal Server error'})
    }
}

