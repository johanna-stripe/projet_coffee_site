# 1. Cadrage et organisation

## A. Cahier des charges

### Le besoin

Une brûlerie artisanale veut vendre en ligne. Ses clients sont des particuliers qui aiment le café et le thé et qui veulent savoir d'où vient ce qu'ils boivent. La marque se positionne en épicerie fine : chaleureuse, soignée, plutôt haut de gamme, sans jargon.

### Fonctionnalités attendues

| Domaine | Fonctionnalité | Priorité |
|---|---|---|
| Catalogue | Accueil, une page par catégorie, fiche produit détaillée | Indispensable |
| Catalogue | Filtres cumulables (sous-catégorie + une caractéristique) | Important |
| Catalogue | Recherche par mot-clé | Amélioration |
| Compte | Inscription, connexion, déconnexion | Indispensable |
| Compte | Profil et adresses de livraison (ajout, modification, adresse par défaut) | Indispensable |
| Panier | Ajout, modification de quantité, suppression, total | Indispensable |
| Panier | Livraison offerte dès 35 € (barre de progression) | Amélioration |
| Commande | Validation du panier en commande, suivi des statuts | Indispensable |
| Commande | Paiement en ligne | Important |
| Administration | CRUD produits, catégories, marques ; gestion des comptes et des rôles | Indispensable |
| Légal | Mentions légales, confidentialité, consentement aux cookies (RGPD) | Important |

### Contraintes

- **Technique** : API REST en Node.js, base MySQL, interface en React. Tout doit tourner avec Docker.
- **Sécurité** : mots de passe hachés, authentification par jeton, vérification des droits côté serveur, protection contre les injections SQL et les attaques par force brute.
- **Responsive** : le site doit s'afficher correctement du téléphone (320 px) à l'écran large (1920 px).
- **Accessibilité** : contrastes suffisants, focus clavier visible, libellés pour les boutons-icônes.
- **Données** : aucun chiffre, avis ou logo inventé sur le site. Seuls les faits réels de la marque (1998, Provence, torréfaction artisanale, livraison offerte dès 35 €, expédition sous 48 h) apparaissent.

### Les profils d'utilisateurs

J'ai écrit un document à part (`docs/profils-et-authentification.md`) parce que j'ai mis du temps à comprendre la différence entre un compte et un client. En résumé :

| Profil | Compte (`users`) | Fiche (`customer`) | Peut |
|---|---|---|---|
| Visiteur | non | non | voir les produits, s'inscrire, se connecter |
| Invité | non | oui (`user_id` vide) | rien de plus qu'un visiteur pour l'instant |
| Cliente | oui | oui | panier, commandes, profil, adresses |
| Admin | oui | pas forcément | gérer produits, marques, catégories, utilisateurs |

L'invité existe dans la base (la colonne `user_id` de `customer` accepte NULL) mais aucune route ne le gère. J'ai décidé que le compte serait obligatoire pour le panier, pour deux raisons. D'abord la sécurité : avec `authenticate` et `checkCustomerOwner`, une cliente ne peut toucher qu'à son propre panier, alors qu'un invité aurait demandé une route sans authentification et un autre moyen de protéger son panier. Ensuite le stockage : mon panier vit en base, rattaché à une fiche client, donc à une personne identifiée. Si je devais y revenir, je stockerais le panier de l'invité dans le navigateur avant la commande.

---

## B. Cas d'utilisation et user stories

J'ai écrit 43 user stories dans `docs/user-stories.md`, rangées par profil : 13 pour le visiteur, 16 pour le client, 14 pour l'admin (certaines sont des améliorations que je n'ai pas codées). Chaque story a une priorité (M = indispensable, S = important, C = amélioration) et des critères d'acceptation. Les critères de sécurité sont marqués d'un cadenas dans le fichier.

### Cas d'utilisation principaux

```
Visiteur ──► Parcourir le catalogue
         ──► Filtrer les produits
         ──► Consulter une fiche produit
         ──► Créer un compte
         ──► Se connecter

Cliente  ──► (tout ce que fait le visiteur)
         ──► Gérer son profil et ses adresses
         ──► Ajouter / modifier / retirer un produit du panier
         ──► Valider une commande
         ──► Consulter ses commandes

Admin    ──► Gérer produits, catégories, marques
         ──► Gérer les comptes (activer, désactiver, changer le rôle)
         ──► Changer le statut des commandes
```

[CAPTURE : diagramme de cas d'utilisation UML si tu veux un vrai schéma. Le texte ci-dessus suffit comme base pour le redessiner dans draw.io ou Figma.]

### Quelques stories avec leurs critères

| ID | Story | Critères d'acceptation retenus |
|---|---|---|
| V8 | En tant que visiteur, je veux créer un compte afin de pouvoir commander. | Email unique. Mot de passe haché avec bcrypt. Rôle imposé par le serveur, pas par la requête. |
| V9 | En tant que visiteur, je veux me connecter afin d'accéder à mon espace. | Jeton JWT dans un cookie `HttpOnly`. Message générique « identifiants incorrects ». Limite de tentatives. Compte désactivé refusé. |
| C8 | En tant que cliente, je veux voir mon panier et le total afin de contrôler ma commande. | Le prix est lu en base, jamais envoyé par le navigateur. Le panier d'une autre cliente renvoie 403. |
| C11 | En tant que cliente, je veux voir que la livraison est offerte dès 35 € afin de compléter mon panier. | Barre de progression dans le panneau du panier. |
| A10 | En tant qu'admin, je veux désactiver un compte afin de bloquer un abus sans perdre l'historique. | Un compte désactivé ne peut plus se connecter et son jeton existant est rejeté. |

### Ce que les user stories m'ont servi à faire

Au début, je les ai surtout écrites pour structurer mes routes. Mais c'est en relisant la section « exigences de sécurité » (S1 à S15) que j'ai repéré des trous dans mon propre code. Par exemple, `GET /customer/:id` n'a que `authenticate` : une cliente connectée pourrait lire la fiche d'une autre en changeant l'identifiant dans l'URL (une faille de type IDOR). J'ai listé ces écarts à la fin du fichier pour ne pas les oublier. Je les reprends dans la partie sécurité.

---

## C. Gestion de projet et planning

### Méthode

Ma démarche est agile, inspirée de Scrum. Je travaille seule, donc je n'ai pas appliqué Scrum à la lettre : j'ai pris ce qui me servait.

- **Un product backlog** : la liste complète de ce qu'il reste à faire sur le produit (mes user stories avec leurs priorités).
- **Des rôles** : projet solitaire, je tiens à la fois le rôle de Product Owner, de Scrum Master et d'équipe de développement.
- **Des points réguliers** : suivi du planning, review et rétrospective.
- **Des sprints** de une ou deux semaines.
- **Des branches Git courtes**, une par sujet.

### Les sprints

| Sprint | Contenu |
|---|---|
| Sprint 1 : conception et initialisation | MCD, MLD, Node/Express, structure MVC, GitHub |
| Sprint 2 : base de données et identité visuelle | MPD sur MySQL, charte graphique, logo |
| Sprint 3 : back-end | Le CRUD : GET, POST, PUT, PATCH, DELETE |
| Sprint 4 : sécurité et administration | Authentification, rôles, gestion des erreurs |
| Sprint 5 : front React et tests | Pages React, tests unitaires, limiters |

### Les outils

- **Notion**, en kanban (colonnes « à faire », « en cours » et « terminé »), pour le backlog, le découpage des user stories en tâches et le suivi.
- **Un time tracker**, une application que j'ai développée moi-même. Elle compte le temps passé sur un projet ou sur les tâches d'un projet (récapitulatif du temps passé, timer).

Beaucoup d'estimations de temps ont dû être revues, à la hausse, surtout sur le sprint du CRUD et celui de la sécurité.

### Planning réel (d'après l'historique Git)

Le dépôt compte 58 commits. Voici ce qu'il raconte :

| Période | Ce que j'ai fait |
|---|---|
| 15 au 19 août | Premiers commits. Mise en place du back-end Express, de la connexion MySQL. Le 18 août je retire le fichier `.env` du suivi Git et j'ajoute un `.gitignore`. Le 19 août je déplace le `Dockerfile` dans le dossier `backend`. |
| 20 au 28 août | Modèles, services, contrôleurs. Le 28 août, premier commit du frontend. |
| septembre à début octobre | Authentification (JWT, bcrypt, rôles), séparation `users` / `customer`, migrations SQL. |
| 18 octobre | Je passe aux branches et aux pull requests (PR #1 à #7) : correction de la fiche produit, rangement des composants en dossiers, images des produits, jeu de données, routes et pages de l'accueil et des catégories. |
| 20 octobre | Panier côté back-end (PR #8) avec le middleware de propriété du panier. |
| 24 octobre | Panier côté front (PR #9), puis une série de corrections responsive (PR #10 à #14) : débordements, carrousel mobile, filtres. Audit Hallmark. |
| 25 octobre | Wireframes (PR #15) et maquettes (PR #16). |
| 26 au 31 octobre | Brand guideline, ce dossier, ajustements Docker et nginx. |

Un défaut que je vois en relisant : jusqu'au 10 octobre, mes messages de commit s'appellent « new commit », « 4eme commit », « 5eme commit ». Impossible de s'y retrouver. À partir de la PR #1, j'ai adopté des messages à la `feat:`, `fix:`, `style:`, `chore:` (convention « Conventional Commits ») et ça change tout quand je relis.

### Organisation Git

- Branche principale : `master`.
- Une branche par sujet : `feat/cart-frontend`, `fix/responsive`, `style/navbar-recherche`, etc.
- Une pull request par branche, fusionnée dans `master` après relecture de ma part. Seule, je n'ai pas de relectrice, donc je relis le diff sur GitHub avant de fusionner, ce qui m'a plusieurs fois fait voir un oubli.

[À COMPLÉTER si tu veux un vrai diagramme : un diagramme de Gantt simple avec ces six phases. Un tableau suffit si le temps manque.]

---

## D. Environnement de travail

### Poste et outils

| Outil | Usage |
|---|---|
| Windows + WSL2 (Ubuntu) | Système de développement. Le code est sur le disque Windows et j'utilise WSL pour Node, Git et Docker, parce que mes conteneurs et mon futur serveur tournent sous Linux : je travaille dans les mêmes conditions que la production. |
| IntelliJ IDEA / WebStorm | Éditeur (le dépôt contient les dossiers `.idea` et `.iml`). |
| Git et GitHub | Versionnage, branches, pull requests. |
| Postman | Test manuel de l'API. |
| Outil base de données de l'IDE | Consultation de la base (source de données dans `.idea/dataSources.xml`). |
| Docker et Docker Hub | Conteneurs. Les images sont publiées sous `johannastripe/project_coffee_site-backend` et `-frontend`. |
| Figma | Maquettes (les prompts que j'ai utilisés sont dans `docs/Prompt_Figma_*.md`). |
| Claude Code | Aide à la rédaction de la documentation, aux maquettes HTML et à l'audit d'accessibilité. J'ai relu et corrigé ce qu'il produisait. [À ADAPTER : dis précisément ce que tu as fait toi et ce que l'outil a fait. Le jury posera la question.] |

### Choix de la stack technique

| Brique | Choix | Pourquoi |
|---|---|---|
| Langage | JavaScript, Node.js 24 (image `node:24-alpine`) | Un seul langage pour le front et le back : je n'ai qu'une syntaxe à maîtriser et je peux réutiliser les mêmes habitudes (promesses, modules) des deux côtés. L'image Alpine garde le conteneur léger. |
| Serveur | Express 5.2 | Un framework minimaliste : je construis moi-même l'architecture (routes, contrôleurs, services, modèles) et mes middlewares de sécurité (`authenticate`, `authorizeRole`, `checkCustomerOwner`). Express 5 transmet aussi au gestionnaire d'erreurs les échecs des fonctions asynchrones, ce qui évite des `try/catch` partout. |
| Base de données | MySQL 8.4 avec `mysql2` | Mes données sont fortement liées (utilisateur, client, adresse, panier, commande, produit, marque, catégorie). Le modèle relationnel, avec clés étrangères et transactions, convient : valider une commande crée la commande et vide le panier dans une même transaction. `mysql2` permet les requêtes paramétrées, qui protègent de l'injection SQL. 8.4 est une version à support long. |
| Authentification | JWT dans un cookie `HttpOnly`, `bcrypt` | Un cookie `HttpOnly` n'est pas lisible par le JavaScript de la page, ce qui limite les dégâts d'une faille XSS (contrairement à un jeton dans le `localStorage`). `bcrypt` hache les mots de passe avec un sel : ils ne sont jamais stockés en clair. |
| Protection de l'API | `helmet`, `express-rate-limit`, `cors` | Des en-têtes de sécurité, une limite de tentatives contre la force brute sur la connexion, et une liste blanche d'origines autorisées. Ce sont des exigences de ma liste de sécurité (S6, S8, S9). |
| Interface | React 19 | L'interface se découpe en composants réutilisables (barre de navigation, tiroir du panier, fenêtre de connexion, cartes produit). React gère bien l'état partagé, comme le contenu du panier qui s'affiche à plusieurs endroits. |
| Pages | React Router 7 | Navigation entre accueil, catégories, fiche produit et espace client sans recharger la page, et redirection des pages protégées vers la connexion. |
| Outil de build | Vite 8 | Démarrage et rechargement très rapides en développement, et build optimisé pour la production. |
| Appels API | Axios | Un client HTTP simple pour appeler le back-end depuis React. |
| Qualité du code | oxlint | Un linter très rapide qui repère les erreurs courantes pendant l'écriture. |
| Tests | Jest 30 et Supertest | Jest pour les tests unitaires (par exemple les middlewares de rôle) ; Supertest pour appeler les routes d'Express sans lancer un vrai serveur, et vérifier les 401 et 403. |
| Déploiement | Docker, `docker compose`, nginx | Le front est construit (`vite build`) puis servi par nginx ; le back et MySQL tournent dans leurs conteneurs. Un seul `docker compose up` lance l'ensemble, avec les mêmes versions partout. |

[À CONFIRMER : ces raisons viennent de ce que le code fait. Ajoute celles qui sont tes vraies motivations (stack vue en formation, déjà pratiquée, etc.) et dis ce que tu as écarté et pourquoi (par exemple MongoDB à la place de MySQL, Next.js à la place de React + Express). Le jury posera la question.]

### Structure du dépôt

```
project_coffee_site/
├── backend/                 API Express (architecture MVC)
│   ├── routes/              les URL
│   ├── controllers/         lisent la requête, renvoient la réponse
│   ├── services/            la logique métier
│   ├── models/              les requêtes SQL (via mysql2)
│   ├── constantes/          le texte des requêtes SQL
│   ├── security/            authentification, middlewares, hachage, JWT
│   ├── config/database.js   le pool de connexions
│   └── test/                Jest et Supertest
├── frontend/                application React (Vite)
│   └── src/
│       ├── components/      par domaine : auth, cart, home, layout, product, user
│       ├── pages/           Accueil, ProductPage, ProductDetailPage
│       ├── context/         AuthContext, CartContext
│       ├── style/           les CSS
│       └── routes/paths.js  tous les chemins au même endroit
├── database/                migrations SQL
├── coffee_tea_infusion_insert.sql   jeu de données
├── docker-compose.yml
└── docs/                    user stories, wireframes, maquettes, charte, ce dossier
```

### Variables d'environnement

Les secrets (mot de passe MySQL, clé de signature du JWT) vivent dans des fichiers `.env` lus par `dotenv` et par Docker Compose. Ils ne doivent pas être dans Git. Je reviens sur un point précis dans la partie sécurité, parce que j'ai dû corriger ça une première fois en août et que je dois le vérifier encore.
