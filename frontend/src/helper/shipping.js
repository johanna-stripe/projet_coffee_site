// Mêmes règles que le backend (backend/services/orderService.js) : le serveur recalcule toujours le vrai montant,
// ici c'est seulement pour l'affichage.
export const FREE_SHIPPING_THRESHOLD = 35   // livraison standard gratuite à partir de 35 € d'achats
export const SHIPPING_FEE = 4.90
export const EXPRESS_SHIPPING_FEE = 8.90    // express : toujours payante, même au-dessus de 35 €

// value = valeur de l'ENUM shipping_method en base
export const SHIPPING_METHODS = [
    {value: 'standard', label: 'Livraison standard', delay: 'Colissimo · 2 à 4 jours ouvrés'},
    {value: 'express', label: 'Livraison express', delay: 'Chronopost · 1 à 2 jours ouvrés'},
]

export const getShippingCost = (subtotal, method = 'standard') => {
    if (method === 'express') return EXPRESS_SHIPPING_FEE
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}
