//=============================IMPORTS=============================
import {getReviewsByProduct, createReview} from "../services/reviewService.js";


//========================GET REVIEWS OF A PRODUCT========================
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await getReviewsByProduct(req.params.productId)
        return res.json(reviews)

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}

//========================POST A REVIEW========================
export const postProductReview = async (req, res) => {
    try {
        //req.user est rempli par le middleware authenticate
        const review = await createReview(req.params.productId, req.user, req.body ?? {})
        return res.status(201).json(review)

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || 500).json({message: error.message || 'Internal Server error'})
    }
}
