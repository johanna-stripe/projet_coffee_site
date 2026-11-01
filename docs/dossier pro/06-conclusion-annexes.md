# Conclusion

## Difficultés rencontrées et résolutions

### 1. Comprendre la différence entre un compte et un client

**Le problème.** J'avais mis prénom, nom, téléphone et date de naissance dans la table `users`, à côté de l'email et du mot de passe. Ça marchait, jusqu'à ce que je veuille parler d'un client qui n'a pas de compte (un invité) ou d'un administrateur qui n'est pas un client.

**Ce que j'ai fait.** J'ai coupé en deux tables : `users` pour la connexion, `customer` pour les achats. Le panier et les commandes pointent vers `customer`. J'ai écrit une migration (`migration_users_customer.sql`) qui recopie les données avant de supprimer les anciennes colonnes, avec une sauvegarde avant et une requête de vérification après. Puis j'ai écrit `docs/profils-et-authentification.md` pour ne plus jamais l'oublier.

**Ce que j'en retiens.** Penser aux profils *avant* de dessiner les tables aurait évité une migration. Mais c'est la migration qui m'a appris à modifier une base qui contient déjà des données.

### 2. Les secrets qui reviennent dans Git

**Le problème.** Le 18 août j'ai retiré `.env` du suivi Git (deux commits ce jour-là). En vérifiant pour ce dossier, trois fichiers `.env` sont de nouveau suivis, et les dossiers `node_modules` aussi.

**Ce que je fais.** `git rm --cached` sur ces fichiers, un `.gitignore` à la racine, un `.env.example` avec des valeurs factices, et un changement des secrets, puisque l'historique garde les anciennes valeurs.

**Ce que j'en retiens.** Retirer un fichier du suivi une fois ne suffit pas, il faut un `.gitignore` qui l'empêche de revenir. Et vérifier avec `git ls-files`, pas de mémoire.

### 3. Le cookie qui ne passe pas

> [À CONFIRMER : cette difficulté est reconstituée d'après la configuration (CORS + `withCredentials`), pas d'après un souvenir précis. Si ce n'est pas ce qui t'a fait perdre du temps, remplace-la par ta vraie galère.]

**Le problème.** Le front envoyait la requête de connexion, le serveur répondait 200, et pourtant la page suivante me considérait comme déconnectée.

**La cause.** Pour qu'un cookie traverse deux origines (le front sur un port, l'API sur un autre), il faut deux choses en même temps : `withCredentials: true` côté axios et `credentials: true` avec une origine précise (pas `*`) côté CORS. Il en manquait une des deux à chaque fois que je testais.

**Ce que j'en retiens.** Le navigateur ne dit rien quand il refuse un cookie. L'onglet « Réseau » des outils de développement, et la section « Cookies » de la réponse, m'ont sauvée.

### 4. Les routes dans le mauvais ordre

Dans `customerRoutes.js`, `GET /me` doit être déclarée avant `GET /:id`, sinon Express prend « me » pour un identifiant. J'ai laissé un commentaire à cet endroit pour ne pas me refaire piéger. [À COMPLÉTER : dis comment tu l'as découvert, quel message d'erreur tu avais.]

### 5. Le responsive, fait trop tard

**Le problème.** J'ai codé pour mon écran, puis j'ai testé à 375 px : une barre de défilement horizontale, des boutons sur trois lignes, un carrousel qu'on ne pouvait pas faire glisser.

**Ce que j'ai fait.** Un audit (Hallmark) pour obtenir une liste précise plutôt qu'une impression, puis cinq pull requests de corrections le 24 octobre, en commençant par ce qui empêchait d'utiliser le site.

**Ce que j'en retiens.** Le test sur mobile se fait au fil du développement, pas à la fin. Je dois ajouter qu'une partie des corrections est du rattrapage (`responsive.css` surcharge les autres fichiers au lieu qu'ils soient responsive dès le départ), ce qui est efficace mais pas élégant.

### 6. Des messages de commit inutilisables

Avant le 18 octobre, mes commits s'appellent « 4eme commit », « new commit ». Je ne retrouve pas ce que j'ai changé quand. Depuis les pull requests, chaque message commence par `feat:`, `fix:`, `style:` ou `chore:` et l'historique se lit comme un journal. Je ne peux pas réparer le passé sans réécrire l'historique, ce que je n'ose pas faire sur un dépôt déjà publié.

### 7. Un dossier de sécurité qui s'est retourné contre moi

En relisant mon code avec la liste des exigences de sécurité, j'ai trouvé des failles que j'aurais préféré ne pas voir (profil et commandes accessibles à n'importe quel client connecté, total de commande envoyé par le navigateur). J'ai hésité à les écrire dans ce dossier. J'ai fini par le faire, parce qu'un jury qui les trouve seul verra surtout que je ne les avais pas vues, alors que les lister avec la correction prévue montre que je sais ce qu'il faut faire.

---

## Bilan et perspectives

### Ce que j'ai appris

- **À organiser du code en couches.** Voir une requête traverser route, middleware, contrôleur, service, modèle, puis revenir, m'a fait comprendre pourquoi on sépare.
- **À me méfier de ce que je ne contrôle pas.** Tout ce qui vient du navigateur (une quantité, un prix, un identifiant, un rôle) peut être falsifié. Le serveur recalcule ou vérifie.
- **À écrire pour quelqu'un d'autre.** Mes commentaires de code expliquent *pourquoi* parce que j'oublie vite. Ce dossier aussi.
- **À tester vite.** Ma couverture de tests est faible (3 tests unitaires, 2 d'intégration), et les deux failles de propriété sont exactement du genre qu'un test de 403 aurait attrapé tout de suite.

### Ce que je referais autrement

1. Dessiner le MCD et les profils avant la première ligne de SQL.
2. Écrire le test en même temps que la route, surtout pour les droits d'accès.
3. Brancher le déploiement Docker dès le premier jour, pas à la fin.
4. Garder des messages de commit propres depuis le premier.

### Perspectives

| Ordre | Chantier | Pourquoi d'abord |
|---|---|---|
| 1 | **Corriger les failles de la partie 3** : propriété des commandes et du profil, total recalculé côté serveur, codes d'erreur d'authentification, secrets hors de Git | Sécurité avant fonctionnalités |
| 2 | **Aligner le déploiement** : variables d'environnement, CORS, port MySQL, attente du test de santé, script d'initialisation de la base | Pour qu'un `docker compose up` marche sur une machine neuve |
| 3 | **Panier → commande** : écran de validation avec choix d'adresse, table `order_item` qui garde le prix d'achat, paiement délégué à un prestataire certifié (Stripe) | Le site vend enfin quelque chose |
| 4 | **Recherche** par mot-clé avec requête paramétrée et affichage échappé | Story V4 |
| 5 | **Pages légales** : mentions légales, confidentialité, cookies, suppression de compte | Obligation RGPD |
| 6 | **Administration** : écrans pour produits, marques, catégories, utilisateurs, statuts de commande | L'API est prête, il manque l'interface |
| 7 | **Qualité** : tests (Jest, Postman exportés), variables CSS et échelle d'espacement, accessibilité (focus, contrastes), `title` et `description` par page | Dette technique repérée par l'audit |
| 8 | **Plus tard** : mot de passe oublié, email de confirmation, double authentification pour les admins, sauvegardes planifiées de la base | Stories V11, C16, A12, A14 |

---

# Annexes

## Annexe 1. Fichiers du dépôt à joindre

| Document | Chemin |
|---|---|
| User stories et exigences de sécurité | `docs/user-stories.md` |
| Profils et authentification | `docs/profils-et-authentification.md` |
| Charte graphique (brand guideline) | `docs/brand-guideline.md` |
| Wireframes (texte, HTML, images) | `docs/wireframes.md`, `docs/wireframes.html`, `docs/wireframes/` |
| Maquettes desktop et mobile | `docs/mockups/` |
| Prompts Figma | `docs/Prompt_Figma_*.md` |
| Audit d'accessibilité et de design | `docs/audit-hallmark.md` |
| Migrations SQL | `database/` |
| Jeu de données | `coffee_tea_infusion_insert.sql` |
| Docker | `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf` |
| Tests | `backend/test/` |

## Annexe 2. Liste des routes de l'API

Préfixe : `/api/v1`. « Connecté » = cookie `token` valide. « Propriétaire » = en plus, la ressource doit être celle de l'utilisateur.

| Méthode | Route | Accès |
|---|---|---|
| GET | `/products` | public |
| GET | `/products/:id` | public |
| POST, PUT, PATCH, DELETE | `/products`, `/products/:id` | ADMIN |
| GET | `/categories`, `/categories/:id`, `/categories/:id/products` | public |
| POST, PUT, DELETE | `/categories`, `/categories/:id` | ADMIN |
| GET | `/brand`, `/brand/:id`, `/brand/:id/products` | public |
| POST, PUT, DELETE | `/brand`, `/brand/:id` | ADMIN |
| POST | `/auth/register` | public (5 par minute) |
| POST | `/auth/login` | public (5 par minute) |
| POST | `/auth/logout` | public |
| GET | `/auth/me` | connecté |
| GET | `/auth/secured-endpoint` | ADMIN |
| GET | `/customer/me` | connecté |
| GET | `/customer/:id`, `/customer/:id/addresses` | connecté (propriété à ajouter) |
| POST | `/customer` | ADMIN |
| POST | `/customer/:id/address` | connecté (propriété à ajouter) |
| PATCH | `/customer/:id`, `/customer/:id/address/:address_id`, `…/default` | connecté (propriété à ajouter) |
| DELETE | `/customer/:id`, `/customer/:id/addresses/:address_id` | connecté (propriété à ajouter) |
| GET | `/cart/:customer_id` | propriétaire |
| GET | `/cart/:cart_id/products` | propriétaire |
| POST | `/cart/:customer_id` | propriétaire |
| PATCH | `/cart/:cart_id/product/:product_id` | propriétaire |
| DELETE | `/cart/:cart_id/customer/:customer_id`, `/cart/:cart_id/product/:product_id` | propriétaire |
| GET | `/order/:customer_id`, `/order/detail/:order_id` | connecté (propriété à ajouter) |
| POST | `/order/:customer_id` | connecté (propriété à ajouter) |
| PATCH | `/order/:id` | ADMIN |
| GET | `/users`, `/users/:id` | ADMIN |
| POST | `/users/newUser` | ADMIN |
| PATCH | `/users/update-user/:id` | connecté (à restreindre à son propre compte) |
| PATCH | `/users/change-role/:id`, `/users/activate-user/:id`, `/users/deactivate-user/:id` | ADMIN |

## Annexe 3. Dépendances

**Back-end** : express 5, mysql2, bcrypt, jsonwebtoken, cookie-parser, cors, helmet, express-rate-limit, dotenv, nodemon. Tests : jest 30, supertest, cross-env.

**Front-end** : react 19, react-dom, react-router-dom 7, axios, react-icons. Outils : vite 8, @vitejs/plugin-react, babel-plugin-react-compiler, oxlint.

## Annexe 4. À joindre avant le rendu

- [ ] Captures d'écran marquées `[CAPTURE]` dans chaque partie
- [ ] Schéma SQL exporté (`database/schema.sql`)
- [ ] Collection Postman exportée et résultats du plan de tests (partie 5)
- [ ] Sortie de `npm run test:coverage`
- [ ] Sortie de `npm audit` (back-end et front-end)
- [ ] Lien du prototype Figma, s'il existe
- [ ] Mon parcours personnel (introduction)
- [ ] Vérification que `.env` n'est plus suivi par Git
