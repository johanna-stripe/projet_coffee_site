//=============================IMPORTS=============================
import {getDb} from "../config/mongo.js"

//Les avis sont stockés dans MongoDB (collection "reviews"), le reste du site reste dans MySQL.
//Un avis = un document autonome, par exemple :
// { productId: 12, userId: 3, username: "johanna", rating: 5, comment: "Excellent !", createdAt: Date }
//Pas besoin de créer la collection : MongoDB la crée toute seule à la première insertion.

const reviews = () => getDb().collection('reviews')


//========================GET REVIEWS BY PRODUCT=========================
export const findReviewsByProductId = async (productId) => {
    return await reviews()
        .find({productId}, {projection: {userId: 0}})
        //projection userId: 0 → on ne renvoie pas l'id interne de l'utilisateur au public
        .sort({createdAt: -1})
        //du plus récent au plus ancien
        .toArray()
}

//========================GET ONE REVIEW BY PRODUCT AND USER=========================
export const findReviewByProductAndUser = async (productId, userId) => {
    return await reviews().findOne({productId, userId})
}

//========================INSERT REVIEW=========================
export const insertReview = async (review) => {
    const result = await reviews().insertOne(review)
    return result.insertedId
}
