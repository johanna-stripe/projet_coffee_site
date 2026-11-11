// Mêmes règles que le backend (backend/services/orderService.js) : le serveur recalcule toujours le vrai montant,
// ici c'est seulement pour l'affichage.
export const FREE_SHIPPING_THRESHOLD = 35   // livraison gratuite à partir de 35 € d'achats
export const SHIPPING_FEE = 4.90

export const getShippingCost = (subtotal) => subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
