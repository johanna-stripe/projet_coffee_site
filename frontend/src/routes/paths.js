//Centraliser tous les paths dans le même fichier

export const CLIENT_PATHS = {
    home: '/',
    cafeGrain: '/collection-cafe-grain',
    cafeMoulu: '/collection-cafe-moulu',
    the: '/collection-the',
    infusion: '/collection-infusion',
    accessoires: '/collection-accessoires',
    machines: '/collection-machines',
    quiSommesNous: '/qui-sommes-nous',
    login: '/login',
    register: '/register',
    admin: '/admin'
}

export const CATEGORIES = [
    { id: 1, title: 'Café en grain',   path: CLIENT_PATHS.cafeGrain },
    { id: 2, title: 'Café moulu',      path: CLIENT_PATHS.cafeMoulu },
    { id: 3, title: 'Thé',             path: CLIENT_PATHS.the },
    { id: 4, title: 'Infusion',        path: CLIENT_PATHS.infusion },
    { id: 5, title: 'Machines à café', path: CLIENT_PATHS.machines },
    { id: 6, title: 'Accessoires',     path: CLIENT_PATHS.accessoires },
];