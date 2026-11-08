//Centraliser tous les paths dans le même fichier

export const CLIENT_PATHS = {
    home: '/',
    cafeGrain: '/collection-cafe-grain',
    cafeMoulu: '/collection-cafe-moulu',
    the: '/collection-the',
    infusion: '/collection-infusion',
    accessoires: '/collection-accessoires',
    machines: '/collection-machines',
    product: '/produit/:id', // pattern de la route (App.jsx)
    quiSommesNous: '/qui-sommes-nous',
    mentionsLegales: '/mentions-legales',
    cgv: '/cgv',
    login: '/login',
    register: '/register',
    admin: '/admin',
    adminProducts: '/admin/produits',
    adminOrders: '/admin/commandes',
    adminUsers: '/admin/utilisateurs',
}

// lien vers la fiche d'un produit : productPath(27) → '/produit/27'
export const productPath = (productId) => `/produit/${productId}`

// lien vers une page catégorie déjà filtrée sur une sous-catégorie (category_name en base, en minuscules) :
// subCategoryPath('/collection-cafe-grain', 'Café en grain grand cru')
//   → '/collection-cafe-grain?categorie=caf%C3%A9%20en%20grain%20grand%20cru'
export const subCategoryPath = (parentPath, categoryName) =>
    `${parentPath}?categorie=${encodeURIComponent(categoryName.toLowerCase())}`

export const CATEGORIES = [
    { id: 1, title: 'Café en grain',   path: CLIENT_PATHS.cafeGrain },
    { id: 2, title: 'Café moulu',      path: CLIENT_PATHS.cafeMoulu },
    { id: 3, title: 'Thé',             path: CLIENT_PATHS.the },
    { id: 4, title: 'Infusion',        path: CLIENT_PATHS.infusion },
    { id: 5, title: 'Machines à café', path: CLIENT_PATHS.machines },
    { id: 6, title: 'Accessoires',     path: CLIENT_PATHS.accessoires },
];