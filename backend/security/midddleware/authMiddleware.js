import jwt from "jsonwebtoken";
import {errorBuilder} from "../../private methods/privateMethods.js";
import {getByIdUser} from "../userModel.js";

//C'est le middleware qui vient avant authorizeRole : il vérifie que l'utilisateur est bien qui il prétend être (authentification), avant que authorizeRole ne vérifie ses droits (autorisation).

export const authenticate = async (req, res, next) => {
    //Contrairement à authorizeRole, ici c'est directement un middleware (pas une factory), et il est async car on va interroger la base de données (await getByIdUser(...)).
    try {
        //On récupère le header
        const authHeader = req.headers.authorization

        //Verification : s'assurer qu'on a bien le mot clé Bearer devant Token
        if (!authHeader || !authHeader.startsWith('Bearer ')) throw errorBuilder('Token not found', 401)

        //Extract Token
        const token = authHeader.split(' ')[1]
        //exemple : "Bearer zjhefzkjhdvd5263871"
        //On veut récupérer juste le token qui se trouve après "Bearer "
        //Donc on split à l'espace, ça nous crée un tableau : index [0] = Bearer, index [1] = zjhefzkjhdvd5263871
        // --> on récupére l'index 1 qui est le token

        //Decodage du Token (on utilise la bibliothèque de Json Webtoken)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //jwt.verify() fait deux choses en une seule étape :
        // Elle vérifie la signature du token avec la clé secrète stockée dans les variables d'environnement (JWT_SECRET), ce qui garantit que le token n'a pas été falsifié.
        // Elle vérifie l'expiration du token (si un exp a été défini à la création).
        // Si le token est invalide ou expiré, jwt.verify lance automatiquement une exception (qui sera capturée par le catch plus bas).
        // Si tout est valide, elle retourne le payload décodé (les données qui avaient été encodées dans le token à sa création, typiquement { id: ..., iat: ..., exp: ... }).

        //Ce qu'on va stoker dans decodedToken est donc notre User (un object)
        //donc mtn vérification que l'user est bien en bdd (qu'il existe bien).
        const user = await getByIdUser(decoded.id)
        // Le token contenait normalement seulement l'id de l'utilisateur (bonne pratique : ne pas stocker de données sensibles ou changeantes dans le token).
        // On va donc chercher en BDD l'utilisateur correspondant, pour récupérer ses infos à jour (rôle, statut actif, etc.) — le contenu du token peut être obsolète si l'utilisateur a été modifié depuis sa connexion.

        if (!user) throw errorBuilder('User not found', 401)
        if (!user.is_active) throw errorBuilder('Account deactivated', 403)

        req.user = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role
        }

        //On construit un objet user "propre" (on ne prend que certains champs — notamment on évite de mettre le mot de passe hashé ou d'autres données sensibles) et on l'attache à req.user.
        //C'est exactement cet objet que ton middleware authorizeRole utilisera ensuite via req.user.role.
        //ici on appelle findUserById, ce qui va nous retourner tous les champs de user (id, username mais aussi password, is_active etc.), et on veut pas tout et surtout éviter d'exposer des données sensibles.
        //Si demain la table users en BDD gagne 15 nouvelles colonnes, req.user ne change pas — sauf si tu décides explicitement de l'enrichir.
        //user (l'objet brut de la BDD) peut avoir des noms de colonnes un peu "techniques" ou incohérents, comme ici user_id (avec underscore, convention SQL) alors que le reste de ton code utilise plutôt du camelCase (userId). En reconstruisant l'objet, tu peux uniformiser les noms de champs utilisés dans ton application, indépendamment de la structure de la BDD.

        next();
        //Tout s'est bien passé → on passe la main au middleware/route suivant.

    } catch (error) {
        console.log(error)
        throw res.status(500).json({error: error.message || 'Invalid or expired Token'})
    }
}