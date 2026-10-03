import jwt from "jsonwebtoken";
import {errorBuilder} from "../../private methods/privateMethods.js";
import {getByIdUser} from "../../models/userModel.js";

//C'est le middleware qui vient avant authorizeRole : il vérifie que l'utilisateur est bien qui il prétend être (authentification), avant que authorizeRole ne vérifie ses droits (autorisation).

export const authenticate = async (req, res, next) => {
    //Contrairement à authorizeRole, ici c'est directement un middleware (pas une factory), et il est async car on va interroger la base de données (await getByIdUser(...)).
    try {
        const token = req.cookies.token
        if(!token) throw errorBuilder('Token not found')

        //Decodage du Token (on utilise la bibliothèque de Json Webtoken)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)

        const user = await getByIdUser(decoded.id)
        /*Ce qu'on va stoker dans decoded est donc notre User (un object)
        donc mtn vérification que l'user est bien en bdd (qu'il existe bien)
        Le token contenait normalement seulement l'id de l'utilisateur (bonne pratique : ne pas stocker de données sensibles ou changeantes dans le token).
        On va donc chercher en BDD l'utilisateur correspondant, pour récupérer ses infos à jour (rôle, statut actif, etc.) — le contenu du token peut être obsolète si l'utilisateur a été modifié depuis sa connexion.*/

        if (!user) throw errorBuilder('User not found', 401)
        if (!user.is_active) throw errorBuilder('Account deactivated', 403)

        req.user = {
            id: user.user_id,           // utilisé par customerController (req.user.id) et le front (user.id)
            user_id: user.user_id,
            customer_id: user.customer_id,
            username: user.username,
            email: user.email,
            // infos venant de la table customer (LEFT JOIN dans getByIdUser)
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            birth_date: user.birth_date,
            role: user.role
        }

        /*
        On construit un objet user "propre" (on ne prend que certains champs — notamment on évite de mettre le mot de passe hashé ou d'autres données sensibles) et on l'attache à req.user.
        C'est exactement cet objet que ton middleware authorizeRole utilisera ensuite via req.user.role.
        ici on appelle findUserById, ce qui va nous retourner tous les champs de user (id, username mais aussi password, is_active etc.), et on veut pas tout et surtout éviter d'exposer des données sensibles.
        Si demain la table users en BDD gagne 15 nouvelles colonnes, req.user ne change pas — sauf si tu décides explicitement de l'enrichir.
        user (l'objet brut de la BDD) peut avoir des noms de colonnes un peu "techniques" ou incohérents, comme ici user_id (avec underscore, convention SQL) alors que le reste de ton code utilise plutôt du camelCase (userId). En reconstruisant l'objet, tu peux uniformiser les noms de champs utilisés dans ton application, indépendamment de la structure de la BDD.
        */

        next();
        //Tout s'est bien passé → on passe la main au middleware/route suivant.

    } catch (error) {
        console.log(error)
        return res.status(401).json({error: error.message || 'Invalid or expired Token'})
    }
}