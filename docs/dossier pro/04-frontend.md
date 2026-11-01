# 4. Développement du front-end

## A. Architecture

### Les outils

| Brique | Choix | Pourquoi |
|---|---|---|
| Bibliothèque | React 19 | Composants réutilisables, c'est ce qu'on a vu en formation |
| Outil de build | Vite 8 | Démarrage rapide en développement, build optimisé en production |
| Navigation | React Router 7 | Pages sans rechargement, URL propres |
| Appels API | axios | Une instance configurée une fois (`withCredentials`) |
| Icônes | react-icons | Remplace les emojis (l'audit en avait relevé quelques-uns pour l'œil du mot de passe) |
| Qualité | oxlint, plugin React Compiler | Analyse statique rapide, optimisation automatique des rendus |

Pas de bibliothèque de composants (pas de Bootstrap, pas de Tailwind). Tout le CSS est écrit à la main, par fichier, avec des noms de classes dans le style BEM (`product-detail__title`, `cart-drawer__header`). C'était plus long, mais je voulais comprendre ce que je fabriquais.

### Organisation du dossier `src/`

```
src/
├── main.jsx            point d'entrée ; charge les CSS (responsive.css EN DERNIER)
├── App.jsx             routeur + fournisseurs de contexte + éléments communs
├── axios/              instance axios
├── context/            AuthContext, CartContext
├── routes/paths.js     tous les chemins et les catégories au même endroit
├── pages/              Accueil, ProductPage, ProductDetailPage
├── components/
│   ├── auth/           AuthModal, LoginForm, RegisterForm
│   ├── cart/           CartDrawer
│   ├── home/           Slider, Selection, SelectionClient, History
│   ├── layout/         NavBar, SubMenu, TopBanner, TrustBadges, Footer, ScrollToTop
│   ├── product/        ProductCard, ProductHeader, ProductDetail, ProductFooter
│   └── user/           UserAccount, UserInformation, UserAddresses, UserSecurity, UserPuscharses
├── helper/             useMediaQuery, fonctions utilitaires
└── style/              un CSS par zone (+ settings.css et responsive.css)
```

Le 18 octobre j'ai rangé les composants en dossiers par domaine (PR #2). Avant, tout était à plat dans `components/` et je perdais du temps à retrouver un fichier.

### Un seul endroit pour les chemins

`routes/paths.js` contient les chemins du site (`CLIENT_PATHS`), la liste des six catégories (`CATEGORIES`) et deux petites fonctions, `productPath(id)` et `subCategoryPath(parent, nom)`. Dans `App.jsx`, les routes de catégories sont générées avec un `CATEGORIES.map(...)`, donc ajouter une catégorie revient à ajouter une ligne dans un tableau.

### Deux contextes React

Je n'ai pas utilisé Redux. Deux contextes suffisent :

| Contexte | Ce qu'il porte |
|---|---|
| `AuthContext` | `user`, `login`, `register`, `logout`, `isAuthenticated`, `isAdmin`, l'état de la modale de connexion |
| `CartContext` | `items`, `cartId`, `addToCart`, `updateQuantity`, `removeItem`, l'état du panneau du panier |

`AuthContext` vérifie au démarrage si l'utilisateur est déjà connecté en appelant `GET /auth/me` dans un `useEffect`. Pourquoi : React oublie son état à chaque rechargement de page, mais le cookie, lui, est toujours là. Sans cet appel, appuyer sur F5 déconnecterait visuellement la cliente. Un booléen `authLoading` évite de la rediriger avant que la réponse arrive.

`CartContext` dépend d'`AuthContext` : il recharge le panier quand `user` change. Il y a un petit détail que j'aime bien : si un visiteur non connecté clique sur « Ajouter au panier », l'article est gardé dans `pendingItem`, le panneau s'ouvre et l'invite à se connecter, puis l'article est ajouté une fois la connexion faite. Le visiteur ne perd pas son geste.

---

## B. Intégration statique : HTML, CSS, responsive, accessibilité, SEO

### HTML sémantique

Chaque composant utilise la balise qui correspond à son rôle : `<aside role="dialog">` pour le panneau du panier, `<header>` dans le panneau, `<figure>` et `<figcaption>` pour la photo du produit, `<button type="button">` pour les actions (jamais un `<div>` cliquable), `<h1>` unique par page (le nom du produit sur la fiche).

### CSS

- Les couleurs de la charte sont déclarées en variables dans `:root` (`--color-primary`, `--color-secondary`, etc.), voir `style.css`.
- Une classe CSS par composant avec un préfixe de bloc, ce qui évite les collisions entre fichiers.
- `settings.css` contient des classes utilitaires (`font-size-14px`, `text-align-center`, `flex-direction-column`). Je les ai créées tôt et je m'en suis beaucoup servie. L'audit les a pointées du doigt : elles figent des valeurs en pixels, hors d'une échelle d'espacement. Je le sais, c'est dans les perspectives.
- `responsive.css` est importé en dernier dans `main.jsx` (le commentaire dit « en dernier : doit surcharger les styles des composants »). Sinon les règles des composants gagneraient à spécificité égale.

### Responsive

Points de rupture utilisés : 1280, 1100, 900 et 600 px (et 480 px pour le panneau du panier). Le point à 900 px est celui qui compte : en dessous, la barre de navigation devient un menu burger et les sous-menus s'ouvrent en accordéon au clic, parce qu'il n'y a pas de survol sur un écran tactile.

Pour que le JavaScript sache dans quel mode on est, j'ai écrit un petit hook, `useMediaQuery`, qui écoute `window.matchMedia` et se met à jour quand la fenêtre change de taille.

La PR #10 et la PR #11 du 24 octobre corrigent ce que l'audit a trouvé en premier :

| Problème | Correction |
|---|---|
| Un `overflow-x: hidden` sur `html` cassait les éléments `sticky` | `overflow-x: clip` |
| Un bloc dépassait de 46 px de l'écran à 375 px et la page scrollait à l'horizontale | Empilement sous 60 rem, retrait des largeurs « bureau » sur téléphone |
| Le bouton « Ajouter au panier » passait sur 3 lignes à 320 px | Libellé et espacement ajustés |
| Sur écran de 1920 px, le texte du hero collait au bord gauche | Conteneur centré, largeur maximale |
| Carrousel inutilisable au doigt | Changement de slide au glissement (PR #14) |

Je testais sept largeurs : 320, 375, 768, 1024, 1280, 1440 et 1920 px.

[CAPTURE : la page d'accueil à 375 px (mobile) et à 1440 px (bureau).]

### Accessibilité

Ce qui est en place :

- Les boutons qui n'ont qu'une icône ont un `aria-label` (« Fermer le panier », « Diminuer la quantité », « Retirer X du panier »).
- La barre de progression de la livraison offerte est une vraie barre (`aria-valuenow`, `aria-valuemax`).
- La quantité sur la fiche produit est annoncée aux lecteurs d'écran (`aria-live="polite"`).
- Les icônes purement décoratives sont masquées (`aria-hidden="true"`).
- Le bouton « afficher le mot de passe » change son libellé selon l'état.
- Les animations respectent `prefers-reduced-motion`.
- Les images de produit ont un `alt` (le nom du produit).

Ce que l'audit a trouvé en plus, avec l'état à ce jour :

| Constat | État |
|---|---|
| Aucun focus visible sur le champ de recherche | à corriger (`:focus-visible`) |
| Certains textes sous les 4,5:1 de contraste (par exemple 2,01:1 sur « Voir tous nos cafés ») | à corriger |
| Texte de 10 px sur des libellés | à corriger (12 px minimum) |
| Pas d'état `:active` sur la modale | à corriger |

### SEO

Le site est une application d'une seule page (SPA) : le HTML initial est presque vide et le contenu est construit par JavaScript. C'est une limite pour le référencement.

Ce qui est fait : une balise `viewport`, des URL lisibles (`/collection-cafe-grain`, `/produit/27`), des titres de pages structurés (`h1`, `h2`), des `alt` sur les images.

Ce qui manque : le `<title>` du fichier `index.html` est encore « frontend » (valeur par défaut de Vite) et il n'y a pas de `<meta name="description">`. Ce sont deux lignes à écrire et ce sont les premières que je corrigerai. Pour aller plus loin il faudrait un titre et une description différents par page (par exemple avec `react-helmet-async`), un `sitemap.xml`, et réfléchir à un rendu côté serveur si le référencement devient un vrai enjeu.

---

## C. Partie dynamique : React, filtres, modales, appels API

### Les appels API

L'instance axios est créée une fois :

```js
const api = axios.create({
    baseURL: "http://localhost:8800/api/v1",
    withCredentials: true,
})
```

Chaque composant importe `api` et appelle `api.get('/products')`, `api.post(...)`. L'adresse du serveur est écrite en dur ici. C'est un défaut : pour un déploiement autre qu'en local, il faut la lire depuis une variable d'environnement (`import.meta.env.VITE_API_URL` avec Vite). Le fichier garde d'ailleurs un commentaire à moitié effacé, `process.env.REACT_APP_API_URL ||`, preuve que j'ai essayé et que ça ne marchait pas, parce que `process.env` est une convention de Create React App et que Vite utilise `import.meta.env`.

### Les filtres de la page catégorie

La page `ProductPage` charge les produits (`GET /products`), garde ceux de la catégorie courante, puis applique **deux filtres cumulables** :

1. **La sous-catégorie**, en haut (« café en grain grand cru », « café en grain biologique »…). Elle vit dans l'URL : `?categorie=café en grain biologique`.
2. **Une caractéristique**, en dessous, qui change selon la catégorie : torréfaction pour le café en grain, mouture pour le café moulu, technologie pour les machines, usage pour les accessoires.

Les deux configurations sont des objets (`FILTERED_CATEGORY` et `FILTERS`) indexés par identifiant de catégorie. Ajouter un filtre ne demande pas de toucher à la logique.

Le choix qui me plaît le plus : mettre la sous-catégorie dans l'URL (via `useSearchParams`) plutôt que dans un `useState`. Le menu de la barre de navigation peut alors ouvrir directement la bonne page déjà filtrée, le bouton « retour » du navigateur fonctionne, et on peut partager le lien. La contrepartie : j'ai dû faire attention à ce que le défilement automatique vers les filtres n'ait lieu qu'à l'arrivée sur la page, sinon chaque clic sur un filtre faisait remonter ou descendre la page.

Pendant le chargement, la page affiche huit cartes grises (« squelettes ») au lieu d'un écran vide, puis les vraies cartes apparaissent en fondu. Le compteur « N produit(s) » apparaît sur la dernière barre de filtres.

Une limite assumée : le filtrage se fait dans le navigateur, sur la liste complète des produits. Avec une centaine de produits c'est invisible. Avec des milliers il faudrait filtrer côté serveur, avec les paramètres dans la requête SQL (c'est la story V3).

### Les modales

Trois éléments flottants : la modale de connexion et d'inscription (`AuthModal`), l'espace client (`UserAccount`) et le panneau du panier (`CartDrawer`).

Le principe est le même pour les trois :

- L'état « ouvert ou fermé » est dans un contexte (`isAuthModalOpen`, `isCartOpen`) pour que n'importe quel composant puisse l'ouvrir. L'icône utilisateur de la barre, le bouton « Ajouter au panier » d'un visiteur ou le lien du panneau appellent la même fonction.
- Un clic sur le fond sombre ferme la fenêtre ; un `stopPropagation` sur la fenêtre empêche qu'un clic à l'intérieur remonte jusqu'au fond.
- `role="dialog"` et `aria-label` sur le conteneur.

### Le panier côté interface

`CartDrawer` calcule le nombre d'articles, le sous-total et la progression vers la livraison offerte **à chaque rendu**, à partir de la liste `items`. Pas de `useState` pour ça : une donnée qu'on peut calculer ne doit pas être stockée, sinon elle risque d'être désynchronisée. Un détail trouvé en route : MySQL renvoie le prix en texte, d'où le `Number(item.price)` avant de multiplier.

Chaque action (ajout, quantité, suppression) envoie une requête, puis **recharge le panier** depuis le serveur plutôt que de modifier l'état local à la main. C'est un aller-retour de plus, mais l'affichage reflète toujours la base. En cas d'erreur, l'état n'est pas touché : le panier affiché reste celui de la base.

Le bouton « − » est désactivé à la quantité 1 et le bouton « + » à la quantité maximale (le stock), ce qui évite d'envoyer des requêtes inutiles.

### Le carrousel de l'accueil

`Slider.jsx` : changement de slide par flèches, par points et, depuis la PR #14, au glissement du doigt sur mobile. Les flèches ont un `aria-label`. C'est le composant sur lequel j'ai le plus bataillé avec la gestion des événements tactiles.

### Ce qui reste à faire côté interface

Pas d'écran d'administration, pas d'écran de validation de commande (la route API existe), pas de page « Qui sommes-nous » ni de pages légales, pas de recherche. Le lien « Qui sommes-nous ? » du menu fait défiler jusqu'à la section « brûlerie » de l'accueil.

[CAPTURE : la page catégorie avec deux filtres actifs, la modale de connexion, le panneau du panier avec la barre de livraison offerte.]
