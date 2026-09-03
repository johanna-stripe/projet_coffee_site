import {errorBuilder} from "../../private methods/privateMethods.js";


export const authorizeRole = (...allowedRoles) => {
    //ici pas besoin de async car on attend pas de réponse de la bdd
    // ...allowedRoles car on cherche en paramètre la liste de roles, il peut y en avoir 1 ou plusieurs

    return (req, res, next) => {
        //verification que l'user est bien authentifié
        if (!req.user) return errorBuilder('User not authenticated', 401)

        //vérification du role de l'user
        if(!allowedRoles.includes(req.user.role)) return errorBuilder('Access Denied',403)

        next();
    };
};

