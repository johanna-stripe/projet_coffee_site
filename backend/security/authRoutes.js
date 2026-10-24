import express from "express";
import {
    register,
    login,
    securedEnPoint, logout,
} from "./authController.js";
import {authenticate} from "./middleware/authMiddleware.js";
import {authorizeRole} from "./middleware/roleMiddleware.js";

const router = express.Router();
export default router

//===========POST===============
router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.get('/secured-endpoint', authenticate, authorizeRole("ADMIN"), securedEnPoint)

router.get('/me', authenticate, securedEnPoint)
//role : Tester/démontrer que authenticate fonctionne (en envoyant un message)
// authenticate : vérifie le token JWT, va chercher l'utilisateur en BDD, et si tout est bon, attache req.user = {...} puis appelle next().
// securedEndpoint : le vrai contrôleur, exécuté seulement si authenticate a laissé passer la requête (donc seulement si l'utilisateur est authentifié).


