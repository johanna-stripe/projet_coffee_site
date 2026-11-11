// minuscules + sans accents : « Thé » et « the » doivent se trouver mutuellement
export const normalize = (text) =>
    String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// découpe un texte en mots (sans accents, sans ponctuation) : « Café en grain, bio » → [cafe, en, grain, bio]
const tokenize = (text) => normalize(text).split(/[^a-z0-9]+/).filter(Boolean)

// champs où l'on cherche, du plus important au moins important (le nom pèse plus que la description)
const FIELD_WEIGHTS = {
    product_name: 3,
    category_name: 3,
    brand_name: 2,
    origin: 1,
    product_description: 1,
}

// poids du meilleur champ où le mot saisi COMMENCE un mot ; 0 si le mot n'apparaît nulle part
// (début de mot : « the » trouve « thé vert » mais plus « Éthiopie »)
const wordScore = (product, word) => {
    let best = 0
    for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
        if (weight > best && tokenize(product[field]).some((token) => token.startsWith(word))) {
            best = weight
        }
    }
    return best
}

// renvoie les produits qui correspondent à la saisie, les plus pertinents d'abord
// chaque mot saisi doit se retrouver au début d'un mot du produit (« café brésil » → les deux mots)
export const searchProducts = (products, query) => {
    const words = tokenize(query)
    if (words.length === 0) return []

    return products
        .map((product) => {
            const scores = words.map((word) => wordScore(product, word))
            // un seul mot introuvable et le produit est écarté (score à null)
            const total = scores.every((score) => score > 0) ? scores.reduce((sum, score) => sum + score, 0) : null
            return {product, total}
        })
        .filter((item) => item.total !== null)
        .sort((a, b) => b.total - a.total) // tri stable : à score égal, l'ordre de la base est gardé
        .map((item) => item.product)
}
