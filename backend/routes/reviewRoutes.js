//=============================IMPORTS=============================
import express from "express";
import {getProductReviews, postProductReview} from "../controllers/reviewController.js";
import {authenticate} from "../security/middleware/authMiddleware.js";

const router = express.Router({mergeParams: true});
//mergeParams: true → permet de lire :productId, défini dans app.js au moment du app.use()


//===================GET========================
//Lire les avis d'un produit (public) — GET /products/:productId/reviews
router.get('/', getProductReviews)

//===================POST========================
//Laisser un avis (connecté) — POST /products/:productId/reviews
router.post('/', authenticate, postProductReview)

export default router
