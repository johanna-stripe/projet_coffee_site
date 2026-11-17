//=============================IMPORTS=============================
import {findReviewsByProductId, findReviewByProductAndUser, insertReview} from "../models/reviewModel.js";
import {findProductInfoById} from "../models/productModel.js";
import {errorBuilder} from "../private methods/privateMethods.js";


//Vérifie que l'id du produit est un entier positif et que le produit existe bien dans MySQL
const checkProduct = async (rawProductId) => {
    const productId = Number(rawProductId)
    if (!Number.isInteger(productId) || productId <= 0) {
        throw errorBuilder('Product id is not valid', 400)
    }
    const product = await findProductInfoById(productId)
    if (!product) throw errorBuilder('Product could not be found', 404)
    return productId
}

//========================GET REVIEWS=========================
export const getReviewsByProduct = async (rawProductId) => {
    const productId = await checkProduct(rawProductId)
    return await findReviewsByProductId(productId)
}

//========================CREATE REVIEW=========================
export const createReview = async (rawProductId, user, {rating, comment}) => {
    const productId = await checkProduct(rawProductId)

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw errorBuilder('Rating must be a whole number between 1 and 5', 400)
    }
    if (typeof comment !== 'string' || comment.trim().length < 3 || comment.trim().length > 1000) {
        throw errorBuilder('Comment must contain between 3 and 1000 characters', 400)
    }

    //un seul avis par utilisateur et par produit
    const existing = await findReviewByProductAndUser(productId, user.user_id)
    if (existing) throw errorBuilder('You already reviewed this product', 409)

    const review = {
        productId,
        userId: user.user_id,
        username: user.username,
        rating,
        comment: comment.trim(),
        createdAt: new Date()
    }
    review._id = await insertReview(review)
    delete review.userId
    return review
}
