# 3. Développement du back-end

## A. Architecture MVC

### Pourquoi cette organisation

Le back-end est une API REST en Node.js avec Express 5. Je l'ai découpé en couches, une par responsabilité. Ce n'est pas du MVC pur (il n'y a pas de vue côté serveur, la « vue » est le front React) mais l'idée est la même : chaque fichier fait une seule chose.

```
Requête HTTP
    │
    ▼
 routes/        associe une URL + une méthode à un contrôleur, et pose les middlewares
    │
    ▼
 middlewares    authenticate, authorizeRole, checkCustomerOwner, checkCartOwner
    │
    ▼
 controllers/   lit req.params / req.body, appelle le service, choisit le code HTTP
    │
    ▼
 services/      règles métier : validation, liste blanche de champs, assemblage des données
    │
    ▼
 models/        envoie les requêtes SQL à MySQL (mysql2) et renvoie les lignes
    │
    ▼
 constantes/    le texte des requêtes SQL, rangé à part
```

Un exemple suivi de bout en bout, l'ajout au panier :

1. `POST /api/v1/cart/:customer_id` arrive dans `cartRoutes.js`.
2. `authenticate` lit le cookie, vérifie le JWT, charge l'utilisateur en base.
3. `checkCustomerOwner` compare `req.user.customer_id` à `:customer_id`. Si ça ne colle pas : 403.
4. `addItemToCart` (contrôleur) passe le corps de la requête au service.
5. `addNewItemToCart` (service) cherche le panier du client, le crée s'il n'existe pas, puis ajoute la ligne.
6. `createANewOrderItem` (modèle) exécute `INSERT … ON DUPLICATE KEY UPDATE`.

### Les routes de l'API

Toutes sont préfixées par `/api/v1`.

| Ressource | Lecture | Écriture |
|---|---|---|
| `/products` | publique (liste, fiche) | ADMIN : POST, PUT, PATCH, DELETE |
| `/categories` | publique (liste, une catégorie, ses produits) | ADMIN |
| `/brand` | publique (liste, une marque, ses produits) | ADMIN |
| `/auth` | `GET /me` (connecté) | `POST /register`, `/login`, `/logout` |
| `/customer` | connecté : profil, adresses | connecté : modifier, adresses ; ADMIN : créer un client |
| `/cart` | propriétaire : panier, produits | propriétaire : ajouter, modifier la quantité, supprimer |
| `/order` | connecté : liste, détail | connecté : créer ; ADMIN : modifier le statut |
| `/users` | ADMIN | ADMIN : créer, changer le rôle, activer, désactiver ; connecté : modifier son compte |

Une règle que j'ai apprise à mes dépens : dans `customerRoutes.js`, `GET /me` doit être déclarée **avant** `GET /:id`. Sinon Express lit « me » comme un identifiant. J'ai laissé un commentaire à cet endroit.

Pourquoi `GET /customer/me` existe : le client n'envoie pas son identifiant, le serveur le retrouve à partir du jeton. Il n'y a donc aucun identifiant à falsifier pour lire la fiche d'un autre, ce qui est plus sûr qu'un `GET /customer/:id` où il faudrait vérifier à chaque appel que l'id demandé est bien le sien. Elle ne remplace pas `GET /auth/me`, qui renvoie le *compte* (identité et rôle) alors que `/customer/me` renvoie la *fiche client* (nom, téléphone, adresses), deux choses séparées depuis la scission `users` / `customer`.

### Conventions

- **Versionnage** : `/api/v1/` dans l'URL, pour pouvoir faire évoluer l'API sans casser le front.
- **Codes HTTP** : 200 et 201 pour le succès, 400 pour une entrée invalide, 401 sans jeton valide, 403 pour un droit manquant, 404 pour une ressource absente, 409 pour un conflit (email déjà pris).
- **Erreurs** : une petite fonction `errorBuilder(message, statusCode)` crée une erreur avec son code. Les services la lancent, le contrôleur l'attrape et répond avec `error.statusCode || 500`.
- **Modules ES** : `"type": "module"` dans `package.json`, donc `import` / `export` partout.

### Le pool de connexions

`config/database.js` crée un pool avec `mysql.createPool` plutôt qu'une connexion unique. Le pool garde plusieurs connexions ouvertes et les réutilise, ce qui évite de rouvrir une connexion à chaque requête. Les paramètres viennent de variables d'environnement lues par `dotenv`.

---

## B. Base de données : scripts SQL, utilisateurs et droits

### Scripts

| Fichier | Rôle |
|---|---|
| `coffee_tea_infusion_insert.sql` | Jeu de données : les caractéristiques (origine, torréfaction, intensité, poids) d'une centaine de produits |
| `database/migration_users_customer.sql` | Sépare `users` et `customer` (voir partie 2) |
| `database/migration_default_address.sql` | Ajoute `is_default` aux adresses |

Les deux migrations suivent la même méthode :

1. Un commentaire en tête dit « à lancer **une seule fois** » et, pour la première, rappelle de faire un `mysqldump` avant.
2. Les modifications se font par étapes numérotées, chacune commentée.
3. Une dernière étape de vérification (`DESCRIBE`, ou une requête qui doit renvoyer 0 ligne).

[À FAIRE : ajouter `database/schema.sql` (export `mysqldump --no-data`) pour que le dépôt contienne la création des tables. Aujourd'hui, quelqu'un qui clone le projet ne peut pas recréer la base seul.]

### Requêtes paramétrées

Toutes les valeurs venant de l'extérieur passent par des `?` :

```js
const [rows] = await db.query(FIND_PRODUCT_FULL_INFO_BY_ID, [productId])
```

Le texte SQL contient `WHERE p.product_id = ?` et la valeur est envoyée à part. Un utilisateur qui tape `1; DROP TABLE product` dans l'URL ne fait pas exécuter ce SQL : la chaîne est traitée comme une valeur.

Il y a une exception, les requêtes `PATCH` dont la liste de colonnes change selon ce que le client envoie (`PATCH_PRODUCT(fields)`, `PATCH_CART(fields)`, `PATCH_ORDER(fields)`). Là, les **noms de colonnes** sont insérés dans le texte SQL, et un `?` ne peut pas remplacer un nom de colonne. Pour que ce soit sûr, chaque service filtre d'abord les champs avec une liste blanche :

```js
const allowed_updates = ['quantity']
allowed_updates.forEach((field) => {
    if (changes[field] !== undefined) { ... }
})
```

Un champ qui n'est pas dans la liste est ignoré, donc ne peut jamais arriver dans la requête. Ça protège aussi contre le « mass assignment » : un client ne peut pas envoyer `"role": "ADMIN"` dans un `PATCH` et espérer que ça passe.

### Exemples de requêtes

Les requêtes sont rangées dans `backend/constantes/`, une par constante. En voici trois, choisies parce qu'elles montrent chacune une idée différente. La transaction d'inscription, elle, est présentée juste après.

**1. Lire le catalogue avec des jointures** (`productDBConstantes.js`)

```sql
SELECT p.*, c.category_name, b.brand_name,
       ct.origin, ct.roast, ct.intensity, ct.weight,
       m.technology, m.pressure_power, a.material, a.color
FROM product p
     JOIN category c ON c.category_id = p.category_id
     LEFT JOIN brand b ON b.brand_id = p.brand_id
     LEFT JOIN coffee_tea_infusion ct ON ct.product_id = p.product_id
     LEFT JOIN machines m ON m.product_id = p.product_id
     LEFT JOIN accessories a ON a.product_id = p.product_id
```

[CAPTURE : cette requête exécutée dans l'IDE avec son résultat.]

Un produit a toujours une catégorie, donc `JOIN` suffit. Une marque est facultative, et les caractéristiques n'existent que pour le bon type de produit (le poids n'a pas de sens pour une machine) : avec un `JOIN` simple, ces produits disparaîtraient de la liste. D'où les `LEFT JOIN`, qui gardent tous les produits et laissent `NULL` là où la donnée n'existe pas.

**2. Ajouter au panier sans doublon** (`cartDBConstantes.js`)

```sql
INSERT INTO cart_item(cart_id, product_id, quantity)
VALUES (?, ?, ?)
ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
```

[CAPTURE : la table `cart_item` avant et après deux ajouts du même produit.]

Cette requête s'appuie sur la clé primaire composée (`cart_id`, `product_id`). Si le produit n'est pas encore dans le panier, la ligne est créée. S'il y est déjà, la quantité augmente : avec 2 en panier et 3 ajoutés, on obtient 5. Je n'ai pas besoin d'un `SELECT` préalable pour savoir si la ligne existe, ce qui évite aussi qu'un double clic crée deux lignes.

**3. Lire le panier avec les infos produit** (`cartDBConstantes.js`)

```sql
SELECT ci.quantity, p.product_name, p.price, p.stock, cti.origin, cti.weight
FROM cart_item ci
     JOIN product p ON p.product_id = ci.product_id
     LEFT JOIN coffee_tea_infusion cti ON cti.product_id = ci.product_id
WHERE ci.cart_id = ?
```

[CAPTURE : le résultat pour un panier contenant un café et une machine, avec `origin` et `weight` à `NULL` pour la machine.]

Le `?` reçoit l'identifiant du panier, comme expliqué plus haut. La requête rassemble en une fois ce que la page panier affiche : la quantité vient de `cart_item`, le nom et le prix de `product`, l'origine et le poids de la table de détail.

### Transactions

L'inscription crée deux lignes : un compte (`users`) et une fiche (`customer`). Si la seconde échoue, je ne veux pas d'un compte orphelin. `saveUserWithCustomer` ouvre une transaction :

```js
const connection = await db.getConnection()
try {
    await connection.beginTransaction()
    // INSERT users, puis INSERT ou rattachement customer
    await connection.commit()
} catch (error) {
    await connection.rollback()
    throw error
} finally {
    connection.release()
}
```

Il y a un cas particulier que j'ai prévu : si une fiche « invité » existe déjà avec le même email, elle est rattachée au nouveau compte au lieu d'en créer une deuxième. Si cette fiche est déjà liée à un autre compte, l'inscription est refusée avec un 409.

### Utilisateurs MySQL et droits

Avec Docker, l'image `mysql:8.4` crée deux comptes au premier démarrage à partir de variables d'environnement :

| Compte | Variable | Droits |
|---|---|---|
| `root` | `MYSQL_ROOT_PASSWORD` | tous les droits sur le serveur |
| utilisateur applicatif | `MYSQL_USER` / `MYSQL_PASSWORD` | tous les droits **sur la base `MYSQL_DATABASE` uniquement** |

L'application se connecte avec le compte applicatif, jamais avec `root`. Si quelqu'un vole ses identifiants, il peut lire et modifier cette base mais pas créer d'autres bases ni gérer les comptes.

Pour ne plus administrer la base avec `root`, et pour que le site n'utilise pas mon propre compte, j'ai séparé deux usages : `admin`, réservé à mon usage (WebStorm, MySQL Workbench), et `coffee_app`, utilisé par le backend avec seulement `SELECT, INSERT, UPDATE, DELETE` :

```sql
-- compte du backend : lecture et écriture des données uniquement
CREATE USER 'coffee_app'@'%' IDENTIFIED BY '...';
GRANT SELECT, INSERT, UPDATE, DELETE ON coffee_site_project.* TO 'coffee_app'@'%';

-- mon compte d'administration : tout sur la base, sauf DROP
GRANT ALL PRIVILEGES ON coffee_site_project.* TO 'admin'@'%';
REVOKE DROP ON coffee_site_project.* FROM 'admin'@'%';
```

| Compte | Usage | Portée |
|---|---|---|
| `root` | opérations exceptionnelles, via `docker exec` | tout le serveur |
| `admin` | administration quotidienne de la base | `coffee_site_project` uniquement, sans `DROP` |
| `coffee_app` (`MYSQL_USER`) | le backend | `coffee_site_project`, `SELECT / INSERT / UPDATE / DELETE` uniquement |

J'ai retiré le droit `DROP` à `admin` pour qu'une fausse manipulation dans WebStorm ne puisse pas supprimer la base ou une table. `admin` garde `CREATE`, `ALTER`, `INDEX` et les droits sur les données, ce qui suffit pour faire évoluer le schéma. Dans MySQL, `DROP` couvre à la fois `DROP DATABASE` et `DROP TABLE` : les deux sont donc réservés à `root`. `TRUNCATE`, qui demande aussi ce droit, est remplacé par `DELETE`.

Le compte est créé en `'%'` et non en `'localhost'` : depuis WebStorm ou un autre conteneur, la connexion passe par le réseau Docker et n'est jamais vue comme locale. Chaque compte n'a que les droits dont il a besoin, ce qui limite les dégâts en cas de fuite d'un mot de passe.

Si le backend est compromis (une injection SQL, par exemple), l'attaquant ne peut ni supprimer ni modifier la structure de la base : seules les données sont atteignables.

---

## C. Sécurité et protection des données

J'ai écrit les exigences de sécurité avant de coder les routes (15 lignes, S1 à S15 dans `docs/user-stories.md`), puis je les ai comparées à ce que j'avais fait. Voici le bilan, ligne par ligne, avec ce qui est vraiment en place et ce qui ne l'est pas.

### Authentification

**Hachage des mots de passe.** `bcrypt` avec 12 tours de sel (`SALT_ROUNDS = 12`). Le mot de passe n'est jamais stocké ni renvoyé en clair, et l'objet `req.user` reconstruit explicitement chaque champ pour ne pas laisser passer le hash.

**Jeton JWT dans un cookie.** À la connexion, le serveur signe un jeton avec `JWT_SECRET` (durée : `JWT_EXPIRES_IN`, 1 jour par défaut) et le dépose dans un cookie :

```js
res.cookie('token', result.token, {
    httpOnly: true,                                  // illisible depuis JavaScript
    secure: process.env.NODE_ENV === 'production',   // HTTPS uniquement en production
    sameSite: 'strict',                              // pas envoyé depuis un autre site
    maxAge: 24 * 60 * 60 * 1000
})
```

J'ai choisi le cookie plutôt que le `localStorage`, parce qu'un script malveillant injecté dans la page (XSS) peut lire le `localStorage` mais pas un cookie `HttpOnly`. Du côté React, `axios` est configuré avec `withCredentials: true` pour que le navigateur renvoie le cookie. Le front ne manipule jamais le jeton.

**Le jeton ne contient presque rien.** Il porte l'identifiant, l'email et le rôle. À chaque requête, `authenticate` recharge l'utilisateur en base, ce qui permet de refuser un compte désactivé même si son jeton est encore valide. C'est un compromis : une requête SQL de plus par appel, contre la certitude de toujours travailler avec le rôle à jour.

### Autorisation, à deux niveaux

| Niveau | Middleware | Question | Réponse si non |
|---|---|---|---|
| Rôle | `authorizeRole('ADMIN')` | Cet utilisateur a-t-il le bon rôle ? | 403 |
| Propriété | `checkCustomerOwner`, `checkCartOwner` | Cette ressource est-elle bien la sienne ? | 403 |

Le contrôle de rôle ne suffit pas. Sans la vérification de propriété, n'importe quelle cliente connectée pourrait appeler `GET /cart/2` et lire le panier de quelqu'un d'autre. `checkCustomerOwner` compare l'identifiant client du jeton à celui de l'URL ; `checkCartOwner` va chercher le panier du client en base et compare son `cart_id` à celui de l'URL.

L'ordre compte : `authenticate` d'abord (401 si pas connecté), puis le rôle ou la propriété (403 sinon). Un visiteur reçoit donc un 401, une cliente qui sort de son périmètre un 403.

### Limitation de débit, en-têtes, CORS

```js
app.use(helmet())                                   // en-têtes de sécurité HTTP
app.use(limiter)                                    // 100 requêtes par minute et par IP
app.use('/api/v1/auth/login',    authLimiter)       // 5 par minute
app.use('/api/v1/auth/register', authLimiter)       // 5 par minute
```

- **helmet** pose des en-têtes (par exemple `X-Content-Type-Options`, `Strict-Transport-Security`) qui ferment des attaques classiques. Sans configuration, les valeurs par défaut sont déjà utiles.
- **express-rate-limit** protège contre la force brute. La limite générale est large parce qu'une seule page de mon site fait plusieurs requêtes (profil, adresses, panier). La limite stricte ne vise que la connexion et l'inscription.
- **CORS** n'autorise qu'une origine, avec `credentials: true`, indispensable pour que le cookie circule.

### Validation des entrées

Dans `registerUser` : champs obligatoires, longueur du mot de passe (8 à 16 caractères), email non déjà utilisé. Des fonctions de normalisation (`normalizeEmailAddress`, `normalizePhoneNumber`, dans `privateMethods.js`) nettoient et contrôlent les emails et les numéros de téléphone. Le rôle est imposé par le serveur à l'inscription : un visiteur ne peut pas envoyer `"role": "ADMIN"`.

### Protection des données personnelles (RGPD)

Ce qui est en place : minimisation (je ne demande que prénom, nom, email, mot de passe ; téléphone et date de naissance sont facultatifs), mot de passe haché, cookie non lisible par JavaScript.

Ce qui manque : pages de mentions légales et de politique de confidentialité, bandeau de consentement aux cookies, route pour supprimer son compte avec anonymisation des commandes. Ces points sont dans les user stories (V12, C6) et dans mes perspectives.

### Ce que j'ai trouvé en me relisant

Je préfère l'écrire ici que laisser un jury le trouver. En relisant mon code avec la liste S1 à S15, voici les écarts :

| Écart | Où | Conséquence | Correction prévue |
|---|---|---|---|
| Pas de contrôle de propriété sur le profil, les adresses, les commandes | routes `/customer/:id…` et `/order/…` : seulement `authenticate` | Une cliente connectée peut lire la fiche ou les commandes d'une autre en changeant l'identifiant (IDOR) | Ajouter `checkCustomerOwner` et vérifier que la commande appartient au client |
| Le total d'une commande vient du corps de la requête | `createNewOrder` | Le client pourrait envoyer un prix arbitraire | Recalculer le total côté serveur à partir du panier et des prix en base |
| Les erreurs d'authentification renvoient 500 | `authController.js` répond `500` à toute erreur | Une mauvaise connexion devrait donner 401, pas 500 | Utiliser `error.statusCode \|\| 500` comme dans les autres contrôleurs |
| « The email already exists » | `registerUser` | Permet de deviner quels emails ont un compte | Message identique dans tous les cas |
| Mot de passe limité à 16 caractères, sans règle de complexité | `registerUser` | Une limite haute n'a pas de raison d'être et affaiblit | Minimum 12 caractères, limite haute large (64) |
| Rôle créé : `USER`, alors que les user stories parlent de `CUSTOMER` | `authService.js` | Incohérence de vocabulaire | Choisir un mot et le garder partout |
| `console.log(decoded)` dans `authenticate` | `authMiddleware.js` | Le contenu du jeton finit dans les logs | Retirer |
| Origine CORS écrite en dur : `http://localhost:5173` | `app.js` | Le site déployé sur un autre port serait bloqué | Lire `CLIENT_URL` |
| Fichiers `.env` toujours suivis par Git | dépôt | Voir ci-dessous | Retirer du suivi, changer les secrets |

**Le point `.env`.** Le 18 août, j'ai retiré `.env` du suivi Git et ajouté un `.gitignore`. Mais en vérifiant aujourd'hui avec `git ls-files`, trois fichiers `.env` (à la racine, dans `backend/` et dans `frontend/`) sont de nouveau listés comme suivis. Même si le fichier est retiré plus tard, ses anciennes versions restent dans l'historique. Il faut :

1. `git rm --cached .env backend/.env frontend/.env` ;
2. vérifier que `.gitignore` les couvre (il n'y a pas de `.gitignore` à la racine aujourd'hui) ;
3. considérer les secrets comme compromis : en changer le contenu (mot de passe MySQL, `JWT_SECRET`), parce que l'historique Git garde l'ancienne version ;
4. fournir un `.env.example` avec des valeurs factices.

Le dépôt suit aussi les dossiers `node_modules` (plus de 7 000 fichiers). C'est lourd et inutile : même correction, `git rm -r --cached` puis un `.gitignore`.

Ces points sont gênants pour un dossier de sécurité. Ils sont aussi, je crois, ce que j'ai le plus appris : la sécurité, c'est de la vérification répétée, pas une fonctionnalité qu'on coche.
