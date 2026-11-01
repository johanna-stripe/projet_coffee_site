# 5. Tests, déploiement et veille

## A. Tests

### Ce que j'ai, et ce que je n'ai pas

Je commence par l'état réel, parce que cette partie est la plus fragile de mon projet.

| Type de test | Outil | État |
|---|---|---|
| Unitaires (middleware de rôle) | Jest | 3 tests écrits |
| Intégration (route protégée) | Jest + Supertest | 2 tests écrits |
| Tests manuels de l'API | Postman | faits pendant le développement ; [À FAIRE : exporter la collection dans `docs/postman/` et capturer les résultats] |
| Tests de sécurité | Postman | plan ci-dessous ; [À FAIRE : les rejouer et remplir la colonne « résultat »] |
| Tests du front | aucun outil | tests manuels sur 7 largeurs d'écran (voir partie 4) |
| Audit d'accessibilité | Hallmark | fait le 24 octobre |

### Configuration Jest

Le back-end est en modules ES, donc Jest a besoin d'un drapeau Node. Les scripts de `package.json` :

```json
"test": "cross-env NODE_OPTIONS=experimental-vm-modules jest",
"test:coverage": "cross-env NODE_OPTIONS=experimental-vm-modules jest --coverage"
```

`cross-env` sert à ce que la même commande marche sous Windows et sous Linux. `jest.config.js` dit `testEnvironment: "node"` et `transform: {}` (pas de Babel, on teste le code tel quel).

### Tests unitaires : `authorizeRole`

Fichier `test/unit/roleMiddleware.test.js`. Le middleware est une fonction pure : on lui passe de faux `req`, `res`, `next` et on regarde ce qui se passe, sans serveur ni base de données.

| Test | Entrée | Résultat attendu |
|---|---|---|
| Utilisateur non authentifié | `req.user` absent | une erreur 401 est lancée |
| Mauvais rôle | `req.user.role = "USER"`, route réservée ADMIN | une erreur 403 est lancée |
| Bon rôle | `req.user.role = "ADMIN"` | `next()` est appelé |

Le schéma de chaque test est le même : *Arrange* (préparer les données), *Act* (appeler la fonction), *Assert* (vérifier). Je l'ai écrit en commentaires dans le fichier d'intégration pour ne pas l'oublier.

### Tests d'intégration : route protégée

Fichier `test/integration/app.test.js`. Il appelle l'application Express avec Supertest, sans démarrer de serveur sur un port.

1. **Avec un utilisateur réel de la base.** Le test fabrique un jeton signé pour l'identifiant 34 et appelle `GET /api/v1/auth/secured-endpoint` avec le cookie. Il attend un 200. Ce test dépend d'une base de données allumée qui contient cet utilisateur.
2. **Avec un utilisateur simulé (mock).** Le test remplace `getByIdUser` par un faux qui renvoie un administrateur, pour ne plus dépendre de la base.

Un point que je dois reconnaître : le fichier `test/unit/authMiddleware.test.js` est vide. Et dans un projet en modules ES, `jest.mock` ne se comporte pas comme dans un projet CommonJS : il faut `jest.unstable_mockModule` puis un `import()` dynamique. [À FAIRE : lancer `npm run test:coverage`, regarder si le second test passe, et si ce n'est pas le cas le réécrire avec `unstable_mockModule`. Coller le résultat de la couverture ici.]

Le dossier `backend/coverage/` est dans le dépôt : il contient un rapport généré un jour où seuls `roleMiddleware.js` et `privateMethods.js` étaient testés. Ce dossier ne devrait pas être versionné (il se régénère à chaque exécution).

### Plan de tests de l'API (Postman)

Chaque ligne correspond à une exigence de sécurité de `docs/user-stories.md`. La colonne « Attendu » est ce que doit faire une API correcte. La colonne « Aujourd'hui » dit ce que mon code fait d'après ma lecture ; elle est à confirmer par un vrai appel.

| N° | Test | Requête | Attendu | Aujourd'hui | Résultat |
|---|---|---|---|---|---|
| T1 | Route protégée sans jeton | `GET /cart/1` sans cookie | 401 | 401 | [À REMPLIR] |
| T2 | Jeton invalide | `GET /auth/me`, cookie `token=abc` | 401 | 401 | [À REMPLIR] |
| T3 | Compte désactivé | login d'un compte `is_active = false` | refusé | 403 (mais l'erreur sort en 500, voir partie 3) | [À REMPLIR] |
| T4 | Mauvais mot de passe | `POST /auth/login` | 401 | 500 (bug du contrôleur) | [À REMPLIR] |
| T5 | Force brute | 6 `POST /auth/login` en une minute | 429 au 6ᵉ | 429 | [À REMPLIR] |
| T6 | Client sur une route admin | `POST /products` avec un cookie `USER` | 403 | 403 | [À REMPLIR] |
| T7 | Panier d'un autre client | `GET /cart/2` connecté en tant que client 1 | 403 | 403 | [À REMPLIR] |
| T8 | Profil d'un autre client | `GET /customer/2` connecté en tant que client 1 | 403 | **200 (faille IDOR)** | [À REMPLIR] |
| T9 | Commandes d'un autre client | `GET /order/2` connecté en tant que client 1 | 403 | **200 (faille IDOR)** | [À REMPLIR] |
| T10 | Injection SQL | `GET /products/1 OR 1=1` | 404 ou 400, aucune fuite | traité comme une valeur grâce au `?` | [À REMPLIR] |
| T11 | Élévation de rôle | `POST /auth/register` avec `"role":"ADMIN"` | compte créé en `USER` | rôle imposé côté serveur | [À REMPLIR] |
| T12 | Mass assignment | `PATCH /cart/…/product/…` avec `{"price":0}` | champ ignoré | liste blanche : seule `quantity` passe | [À REMPLIR] |
| T13 | Hash jamais renvoyé | `GET /auth/me` | pas de champ `password` | absent de `req.user` | [À REMPLIR] |
| T14 | En-têtes de sécurité | n'importe quelle réponse | présence des en-têtes `helmet` | présents | [À REMPLIR] |

Les lignes T4, T8 et T9 sont celles où mon API ne fait pas encore ce qu'elle devrait. Je les garde dans le plan exprès : un test qui échoue est utile, il montre ce qu'il reste à corriger.

[CAPTURE : écrans Postman de T1, T5, T7, T8 et T14. Sur T5, montre bien la réponse `Too many connection attempts. Retry later`.]

---

## B. Déploiement : Docker, Nginx, procédure pas à pas

### L'architecture déployée

```
          Navigateur
         ┌──────────┐
         │  React   │
         └────┬─────┘
              │ :3000                      :8800
              ▼                              ▲
   ┌────────────────────┐  appels API  ┌─────┴──────────┐        ┌──────────────┐
   │ frontend           │ ───────────► │ backend        │ ─────► │ mysql        │
   │ nginx + build Vite │              │ Node 24 Express│  :3306 │ MySQL 8.4    │
   └────────────────────┘              └────────────────┘        └──────┬───────┘
                                                                        │
                                                                 volume mysql_data
```

Trois conteneurs, un réseau Docker privé (`project_coffee_site_network`) et un volume nommé (`mysql_data`) pour que les données survivent à un redémarrage.

### Les trois images

**Back-end** (`backend/Dockerfile`, `node:24-alpine`) :

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 8800
CMD ["npm", "start"]
```

Je copie `package*.json` et j'installe **avant** de copier le code : tant que les dépendances ne changent pas, Docker réutilise cette couche en cache et le build est rapide. `npm ci` installe exactement les versions du `package-lock.json` et `--omit=dev` laisse de côté Jest et nodemon.

**Front-end** (`frontend/Dockerfile`, build en deux étapes) :

```dockerfile
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

La première étape construit le site avec Node ; la seconde ne garde que les fichiers statiques (`dist`) dans une image Nginx très légère. L'image finale ne contient donc ni Node ni le code source.

**Nginx** (`frontend/nginx.conf`) :

```nginx
server {
   listen 80;
   server_name localhost;
   root /usr/share/nginx/html;
   index index.html;
   location / {
      try_files $uri $uri/ /index.html;
   }
}
```

La ligne `try_files … /index.html` est indispensable pour une application React Router. Sans elle, ouvrir directement `/produit/27` dans le navigateur donnerait une erreur 404 de Nginx, puisqu'aucun fichier de ce nom n'existe. Avec elle, Nginx renvoie `index.html` et c'est React qui affiche la bonne page.

**MySQL** : image officielle `mysql:8.4`, configurée par variables d'environnement, avec un test de santé (`mysqladmin ping`, toutes les 10 secondes, 10 essais).

### `docker-compose.yml`

Les points à retenir :

- Les secrets ne sont pas écrits dans le fichier : `${MYSQL_PASSWORD}`, `${JWT_SECRET}` sont lus dans le `.env`.
- Le back-end attend MySQL (`depends_on`) et le front attend le back-end.
- Les images sont tirées de Docker Hub : `johannastripe/project_coffee_site-backend:latest` et `…-frontend:latest`. J'ai laissé en commentaire le bloc `build:` pour pouvoir reconstruire en local.
- Ports exposés : `3000` (site), `8800` (API), `3308` (MySQL, vers le port 3306 du conteneur).

### Procédure pas à pas

**Prérequis** : Docker et Docker Compose installés.

1. **Récupérer le code** :
   ```bash
   git clone https://github.com/johanna-stripe/projet_coffee_site.git
   cd projet_coffee_site
   ```
2. **Créer le fichier `.env`** à la racine (jamais commité), à partir de ce modèle :
   ```env
   MYSQL_ROOT_PASSWORD=<un mot de passe fort>
   MYSQL_DATABASE=<nom de la base>
   MYSQL_USER=<utilisateur applicatif>
   MYSQL_PASSWORD=<un autre mot de passe fort>
   JWT_SECRET=<une longue chaîne aléatoire>
   JWT_EXPIRES_IN=1d
   CLIENT_URL=http://localhost:3000
   ```
   Pour générer le secret JWT : `openssl rand -hex 32`.
3. **Lancer** :
   ```bash
   docker compose up -d
   ```
4. **Vérifier** que les trois conteneurs tournent :
   ```bash
   docker compose ps
   docker compose logs backend
   ```
   Le journal du back-end doit afficher « Hey, your serveur is running on port 8800 ».
5. **Créer les tables et charger les données** (voir la remarque ci-dessous) :
   ```bash
   docker exec -i coffee-site-mysql mysql -u<utilisateur> -p<mot de passe> <base> < database/schema.sql
   docker exec -i coffee-site-mysql mysql -u<utilisateur> -p<mot de passe> <base> < coffee_tea_infusion_insert.sql
   ```
6. **Ouvrir** `http://localhost:3000` pour le site et `http://localhost:8800` pour tester l'API (la page d'accueil de l'API répond « This is the backend of 'Le Temps d'une tasse' website »).
7. **Arrêter** : `docker compose down` (les données restent). `docker compose down -v` supprime aussi le volume, donc la base.

**Mettre à jour les images** après une modification du code :

```bash
docker build -t johannastripe/project_coffee_site-backend:latest ./backend
docker build -t johannastripe/project_coffee_site-frontend:latest ./frontend
docker push johannastripe/project_coffee_site-backend:latest
docker push johannastripe/project_coffee_site-frontend:latest
docker compose pull && docker compose up -d
```

### Ce qui ne marche pas encore tout à fait

Je préfère lister les écarts que j'ai repérés en relisant mes fichiers de déploiement. Aucun n'est dramatique, mais plusieurs empêcheraient un déploiement propre sur un serveur.

| Écart | Détail | Correction |
|---|---|---|
| Nom de la variable de base | `docker-compose.yml` donne `DB_NAME` au back-end, mais `config/database.js` lit `DB_DATABASE` | Aligner les deux noms |
| Port MySQL vu du back-end | Le compose donne `DB_PORT: 3308`. C'est le port ouvert sur ma machine, pas celui du réseau Docker, où MySQL écoute sur 3306 | `DB_PORT: 3306` |
| Adresse de l'API en dur | `axiosConfig.js` appelle `http://localhost:8800`. `REACT_APP_API_URL` du compose n'est lue par rien, et une variable Vite se fixe **au moment du build**, pas au démarrage | `VITE_API_URL` passée en `ARG` au build |
| CORS en dur | `app.js` n'autorise que `http://localhost:5173` (le serveur de développement de Vite), pas `http://localhost:3000` (le site dans Docker) | Lire `CLIENT_URL` |
| Attente de MySQL | `depends_on: condition: service_started` n'attend pas que MySQL soit prêt, alors qu'un test de santé existe | `condition: service_healthy` |
| Base vide au premier lancement | Aucun script d'initialisation n'est monté dans MySQL | Mettre `schema.sql` et le jeu de données dans `/docker-entrypoint-initdb.d/` |
| Conteneur en `root` | Le back-end tourne avec l'utilisateur par défaut | `USER node` dans le Dockerfile |
| `localhost` dans `nginx.conf` | Sans conséquence ici, à adapter avec un nom de domaine | |
| HTTPS | Aucun. En production, `secure: true` sur le cookie exige HTTPS | Nginx ou un proxy avec un certificat (Let's Encrypt) |

Le cookie du jeton est marqué `secure` seulement quand `NODE_ENV === 'production'`. En local, en HTTP, il fonctionne ; en production, il faudra le HTTPS, sinon le navigateur refusera de le renvoyer.

[CAPTURE : `docker compose ps` avec les trois conteneurs, le site sur `localhost:3000`, et la page Docker Hub des deux images.]

---

## C. Veille technologique et sécurité

### Ce que je surveille

| Sujet | Source | Pourquoi ça compte pour mon projet |
|---|---|---|
| Failles web courantes | OWASP Top 10 | Ma faille IDOR (T8, T9) s'appelle « Broken Access Control » et c'est la première de la liste |
| Dépendances vulnérables | `npm audit`, GitHub Dependabot | Mon back-end embarque `express`, `jsonwebtoken`, `bcrypt`, `mysql2` : une faille dans l'une touche tout le site |
| Versions de Node | nodejs.org (calendrier des versions LTS) | Mes images utilisent `node:24-alpine`, il faut suivre les correctifs |
| Protection des données | CNIL (guides RGPD, cookies) | Mentions légales, consentement aux cookies, droit à l'effacement |
| Cookies et jetons | OWASP Cheat Sheets (sessions, JWT) | Ma décision de ne pas stocker le jeton dans `localStorage` vient de là |
| Accessibilité | RGAA, WCAG | Contrastes, focus clavier, libellés des boutons |
| React et outils front | Documentation de React, blog de Vite | React 19 et le React Compiler sont récents |

[À ADAPTER : garde seulement les sources que tu suis vraiment, et ajoute-en une avec une date. Le jury demande presque toujours « qu'est-ce que vous avez lu récemment et qu'est-ce que ça a changé dans votre code ? ».]

### Trois exemples où la veille a changé mon code

1. **Cookie `HttpOnly` plutôt que `localStorage`** pour le jeton, après avoir compris qu'un script injecté peut lire le `localStorage`.
2. **Le message « Invalid identifiers »** identique que l'email soit inconnu ou le mot de passe faux, pour ne pas révéler quels emails ont un compte. (Je dois encore faire pareil à l'inscription.)
3. **Une liste blanche de champs** sur toutes les routes `PATCH`, pour qu'un client ne puisse pas se donner un rôle ADMIN en ajoutant un champ à sa requête.

### Ce que je ferai ensuite

Lancer `npm audit` sur le back-end et le front-end, corriger ou noter chaque alerte, et ajouter une étape `npm audit` dans une intégration continue (GitHub Actions) pour qu'elle tourne à chaque pull request.
