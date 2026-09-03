import express from "express";
import {
    register,
    login,
    securedEnPoint,
} from "./authController.js";
import {authenticate} from "./midddleware/authMiddleware.js";

const router = express.Router();
export default router

//===========POST===============
router.post('/register', register)

router.post('/login', login)

router.get('/secured-endpoint', authenticate, securedEnPoint)
//role : Tester/démontrer que authenticate fonctionne (en envoyant un message)
// authenticate : vérifie le token JWT, va chercher l'utilisateur en BDD, et si tout est bon, attache req.user = {...} puis appelle next().
// securedEndpoint : le vrai contrôleur, exécuté seulement si authenticate a laissé passer la requête (donc seulement si l'utilisateur est authentifié).


