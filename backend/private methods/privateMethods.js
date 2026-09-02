//======================PRIVATE METHODS============================
export const normalizeText = (text) => {
    if (typeof text !== "string") return ""
    return text.trim().toLowerCase()
}

export const normalizeEmailAddress = (email) => {
    if (typeof email !== "string" || !email.includes('@')) {
        throw errorBuilder('Address mail not valid', 400)
    }
    const trimmed = email.trim().toLowerCase()

    const [local, domain] = trimmed.split('@')
    //.split('@') transforme la chaîne en tableau en la coupant à chaque @.
    //  Entrée	            Résultat de split('@')	    local	    domain
    // "toto@mail.com"	    ["toto", "mail.com"]	    "toto"	    "mail.com"
    if (!local || !domain) {
        throw errorBuilder('Address mail not valid',400)
    }

    const dotIndex = domain.indexOf('.')
    //.indexOf('.') renvoie la position du premier . trouvé dans domain, ou -1 s'il n'y en a aucun.
    //domain	        dotIndex
    // "gmail.com"	    5
    // "gmail"	        -1 (pas de point)
    // ".com"	        0 (point tout au début)
    // "gmail."	        5 (point tout à la fin)
    if (dotIndex <= 0 || dotIndex === domain.length - 1) {
        //On rejette si :
        // dotIndex <= 0 : soit il n'y a pas de point du tout (-1), soit le point est en toute première position (0, comme dans ".com") — dans les deux cas il n'y a rien avant le point
        // dotIndex === domain.length - 1 : le point est le tout dernier caractère (comme "gmail.") — donc rien après le point
        throw errorBuilder('Address mail not valid',400)
    }

    return trimmed
}

export const normalizePhoneNumber = (phone) => {
    if (typeof phone !== "string") {
        throw errorBuilder('Phone number not valid',400)
    }
    const cleaned = phone.trim().replace(/[\s.\-()]/g, '')
    //.trim() retire les espaces au début/fin
    // .replace(/[\s.\-()]/g, '') supprime tous les espaces (même ceux au milieu), points, tirets et parenthèses, qui sont les séparateurs courants dans un numéro de téléphone
    //Le g à la fin de la regex veut dire "global" : ça remplace toutes les occurrences, pas juste la première.
    //Exemple :
    // Entrée	                Résultat
    // "06 12 34 56 78"	        "0612345678"
    // "+33 6.12.34.56.78"	    "+33612345678"
    // "(06) 12-34-56-78"	    "0612345678"
    if (!/^\+?\d{6,15}$/.test(cleaned)) {
        //^ : début de la chaîne
        // \+? : un + optionnel (pour les numéros internationaux comme +33...)
        // \d{6,15} : entre 6 et 15 chiffres (la plage de longueur habituelle pour un numéro de téléphone dans le monde)
        // $ : fin de la chaîne
        // Ça rejette les cas comme "abc123", "06-AB-34", ou une chaîne vide après nettoyage.
        return ""
    }
    return cleaned
}

//Générer des erreurs personnalisées
export const errorBuilder = (message, statusCode = 400) => {
    //message : le message personnalisé
    //statusCode = 400 : par défaut
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

//promo, commentaire, chat = utiliser Mongo
//