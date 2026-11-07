# User stories — Le temps d'une tasse

Format : **En tant que** `<profil>`, **je veux** `<action>` **afin de** `<bénéfice>`.
Priorité : **M** = Must (indispensable), **S** = Should (important), **C** = Could (amélioration).
Les critères d'acceptation de sécurité sont marqués 🔒.

Profils : voir [profils-et-authentification.md](profils-et-authentification.md).

---

## 1. Visiteur (non connecté)

### Catalogue

| ID | User story | Prio | Critères d'acceptation |
|---|---|---|---|
| V1 | En tant que visiteur, je veux consulter la page d'accueil afin de découvrir la boutique. | M | Bandeau, navigation, catégories et réassurance affichés. |
| V2 | En tant que visiteur, je veux parcourir les produits par catégorie (café en grain, moulu, thé, infusion, machines, accessoires) afin de trouver ce qui m'intéresse. | M | Une page par catégorie ; la liste correspond à la catégorie choisie. |
| V3 | En tant que visiteur, je veux filtrer les produits (marque, origine, torréfaction, intensité) afin d'affiner ma recherche. | S | Filtres cumulables ; résultat vide → message explicite. 🔒 Paramètres de filtre validés côté serveur (requêtes paramétrées, pas de concaténation SQL). |
| V4 | En tant que visiteur, je veux rechercher un produit par mot-clé afin de le trouver rapidement. | S | 🔒 La saisie est échappée à l'affichage (pas de XSS) et passée en requête paramétrée (pas d'injection SQL). |
| V5 | En tant que visiteur, je veux voir la fiche détaillée d'un produit (prix, origine, torréfaction, intensité, poids, marque, image) afin de décider de l'acheter. | M | Un identifiant inexistant renvoie une page 404, pas une erreur technique. |
| V6 | En tant que visiteur, je veux consulter les produits d'une marque afin de retrouver mes marques préférées. | C | |
| V7 | En tant que visiteur, je veux utiliser le site sur mobile afin de naviguer depuis mon téléphone. | S | Affichage adapté sous 900 px. |

### Compte et accès

| ID | User story | Prio | Critères d'acceptation |
|---|---|---|---|
| V8 | En tant que visiteur, je veux créer un compte (email, mot de passe, nom, prénom) afin de pouvoir commander. | M | 🔒 Email unique et au format valide. 🔒 Mot de passe fort (longueur minimale, complexité) validé côté serveur. 🔒 Mot de passe haché (bcrypt/argon2), jamais stocké ni renvoyé en clair. 🔒 Message d'erreur identique que l'email existe ou non (pas d'énumération de comptes). 🔒 Le rôle est forcé à `CUSTOMER` côté serveur : un visiteur ne peut pas s'inscrire avec le rôle `ADMIN` en modifiant la requête. |
| V9 | En tant que visiteur, je veux me connecter afin d'accéder à mon espace client. | M | 🔒 Jeton JWT stocké dans un cookie `HttpOnly`, `Secure`, `SameSite`. 🔒 Message générique « identifiants incorrects » (sans dire si c'est l'email ou le mot de passe). 🔒 Limitation du nombre de tentatives (rate limiting) contre la force brute. 🔒 Un compte désactivé (`is_active = false`) ne peut pas se connecter. |
| V10 | En tant que visiteur, je veux être redirigé vers la connexion si je tente d'accéder au panier ou à mes commandes afin de comprendre qu'un compte est nécessaire. | M | 🔒 Les routes protégées renvoient 401 sans jeton valide. |
| V11 | En tant que visiteur, je veux réinitialiser mon mot de passe oublié afin de récupérer l'accès à mon compte. | S | 🔒 Lien à usage unique, expirant (ex. 1 h), envoyé par email. 🔒 Réponse identique que l'email existe ou non. |
| V12 | En tant que visiteur, je veux accepter ou refuser les cookies et consulter les mentions légales / la politique de confidentialité afin de maîtriser mes données (RGPD). | S | Consentement recueilli avant tout cookie non essentiel. |
| V13 | En tant que visiteur, je veux commander sans créer de compte (invité) afin d'aller plus vite. | C | Décision actuelle : compte obligatoire (sécurité du panier et panier stocké en base, voir point ouvert dans les docs). |

---

## 2. Client (connecté, rôle `CUSTOMER`)

### Profil et adresses

| ID | User story | Prio | Critères d'acceptation |
|---|---|---|---|
| C1 | En tant que client, je veux me déconnecter afin de protéger mon compte sur un poste partagé. | M | 🔒 Le cookie `token` est supprimé côté serveur. |
| C2 | En tant que client, je veux consulter mon profil (nom, téléphone, date de naissance, email) afin de vérifier mes informations. | M | 🔒 Je ne vois que **mon** profil : accès à `/customer/:id` refusé (403) si `:id` ≠ mon `customer_id`. |
| C3 | En tant que client, je veux modifier mon profil afin de garder mes informations à jour. | M | 🔒 Seul le propriétaire peut modifier sa fiche. 🔒 Je ne peux pas modifier mon rôle ni `is_active` (liste blanche de champs modifiables, anti « mass assignment »). 🔒 Changement d'email ou de mot de passe : redemander le mot de passe actuel. |
| C4 | En tant que client, je veux ajouter, modifier et supprimer mes adresses de livraison afin de recevoir mes commandes au bon endroit. | M | 🔒 Je ne peux agir que sur mes propres adresses (vérifier que `address_id` appartient à mon `customer_id`). |
| C5 | En tant que client, je veux définir une adresse par défaut afin d'accélérer mes commandes. | S | Une seule adresse par défaut à la fois. 🔒 Propriété vérifiée. |
| C6 | En tant que client, je veux supprimer mon compte et mes données afin d'exercer mon droit à l'effacement (RGPD). | S | 🔒 Confirmation par mot de passe. 🔒 Seul le propriétaire (ou un admin) peut le faire. Les commandes passées sont anonymisées, pas perdues (obligation comptable). |

### Panier

| ID | User story | Prio | Critères d'acceptation |
|---|---|---|---|
| C7 | En tant que client, je veux ajouter un produit à mon panier afin de préparer mon achat. | M | 🔒 Panier lié à mon `customer_id` (`authenticate` + `checkCustomerOwner`). 🔒 Quantité validée (entier positif, borne max) et produit existant. |
| C8 | En tant que client, je veux voir le contenu de mon panier et le total afin de contrôler ma commande. | M | 🔒 Le prix est toujours lu en base, jamais envoyé par le navigateur. 🔒 Accès au panier d'un autre client → 403. |
| C9 | En tant que client, je veux modifier la quantité d'un article ou le retirer afin d'ajuster ma commande. | M | 🔒 `checkCartOwner` : le panier doit m'appartenir. |
| C10 | En tant que client, je veux vider mon panier afin de recommencer. | S | 🔒 Propriété vérifiée. |
| C11 | En tant que client, je veux voir que la livraison est offerte dès 35 € afin d'être incité à compléter mon panier. | C | Règle appliquée côté serveur au calcul du total. |

### Commandes

| ID | User story | Prio | Critères d'acceptation |
|---|---|---|---|
| C12 | En tant que client, je veux valider mon panier en commande avec une adresse de livraison afin d'acheter mes produits. | M | 🔒 Le total est recalculé côté serveur. 🔒 L'adresse choisie m'appartient. 🔒 Panier vide ou produit indisponible → refus avec message clair. 🔒 Création de la commande et vidage du panier dans une transaction SQL. |
| C13 | En tant que client, je veux payer en ligne de façon sécurisée afin de finaliser mon achat. | S | 🔒 Paiement délégué à un prestataire certifié (ex. Stripe) : aucune donnée de carte ne transite ni n'est stockée sur mon serveur. 🔒 HTTPS obligatoire. |
| C14 | En tant que client, je veux consulter la liste de mes commandes et leur statut afin de suivre mes achats. | M | 🔒 `/order/:customer_id` refusé (403) si ce n'est pas mon identifiant. |
| C15 | En tant que client, je veux voir le détail d'une commande afin de retrouver ce que j'ai acheté. | M | 🔒 `/order/detail/:order_id` vérifie que la commande m'appartient (sinon 403/404), pour empêcher d'énumérer les commandes des autres. |
| C16 | En tant que client, je veux recevoir un email de confirmation de commande afin d'avoir une preuve d'achat. | C | |

---

## 3. Administrateur (rôle `ADMIN`)

Toutes les routes d'administration passent par `authenticate` **puis** `authorizeRole('ADMIN')`. Un client connecté qui les appelle reçoit 403 ; un visiteur reçoit 401.

### Produits, catégories et marques

| ID | User story | Prio | Critères d'acceptation |
|---|---|---|---|
| A1 | En tant qu'admin, je veux créer un produit afin d'enrichir le catalogue. | M | 🔒 Validation serveur de tous les champs (prix ≥ 0, stock entier, longueurs de texte). 🔒 Si téléversement d'image : type et taille contrôlés, nom de fichier régénéré. |
| A2 | En tant qu'admin, je veux modifier un produit (prix, description, stock, visibilité) afin de garder le catalogue à jour. | M | 🔒 Champs modifiables en liste blanche. |
| A3 | En tant qu'admin, je veux supprimer ou archiver un produit afin de retirer un article qui n'est plus vendu. | M | Un produit présent dans des commandes passées est archivé, pas supprimé (intégrité de l'historique). |
| A4 | En tant qu'admin, je veux créer, modifier et supprimer des catégories afin d'organiser la boutique. | M | Suppression refusée si la catégorie contient encore des produits. |
| A5 | En tant qu'admin, je veux créer, modifier et supprimer des marques afin de gérer mes fournisseurs. | S | Suppression refusée si des produits y sont rattachés. |

### Commandes

| ID | User story | Prio | Critères d'acceptation |
|---|---|---|---|
| A6 | En tant qu'admin, je veux voir toutes les commandes afin de les traiter. | M | 🔒 Réservé à `ADMIN`. |
| A7 | En tant qu'admin, je veux changer le statut d'une commande (en préparation, expédiée, livrée, annulée) afin d'informer le client. | M | 🔒 Seuls les statuts autorisés sont acceptés ; transitions cohérentes. 🔒 Changement journalisé (qui, quand). |

### Utilisateurs et clients

| ID | User story | Prio | Critères d'acceptation |
|---|---|---|---|
| A8 | En tant qu'admin, je veux lister et consulter les utilisateurs afin de gérer la base clients. | M | 🔒 Le hash du mot de passe n'est jamais renvoyé par l'API. |
| A9 | En tant qu'admin, je veux créer un utilisateur ou une fiche client afin d'aider un client par téléphone. | S | 🔒 Mot de passe temporaire à changer à la première connexion. |
| A10 | En tant qu'admin, je veux activer ou désactiver un compte afin de bloquer un utilisateur abusif sans perdre son historique. | M | 🔒 Un compte désactivé ne peut plus se connecter et son jeton existant est rejeté (`authenticate` vérifie `is_active`). 🔒 Un admin ne peut pas se désactiver lui-même. |
| A11 | En tant qu'admin, je veux changer le rôle d'un utilisateur afin de promouvoir un collaborateur. | S | 🔒 Action réservée à `ADMIN`, journalisée. 🔒 Impossible de retirer le dernier admin. |

### Sécurité et exploitation

| ID | User story | Prio | Critères d'acceptation |
|---|---|---|---|
| A12 | En tant qu'admin, je veux que mes accès soient renforcés afin de protéger le back-office. | S | 🔒 Mot de passe plus strict, session plus courte, option 2FA. |
| A13 | En tant qu'admin, je veux consulter un journal des actions sensibles (connexions, changements de rôle, suppressions) afin de détecter un abus. | C | |
| A14 | En tant qu'admin, je veux que les sauvegardes de la base soient planifiées afin de pouvoir restaurer en cas d'incident. | S | |

---

## 4. Exigences de sécurité transverses

À appliquer à toutes les stories ci-dessus.

| ID | Exigence |
|---|---|
| S1 | **Authentification** : JWT signé avec un secret robuste (variable d'environnement, jamais dans Git), durée de vie limitée, cookie `HttpOnly` + `Secure` + `SameSite`. |
| S2 | **Autorisation à deux niveaux** : rôle (`authorizeRole`) **et** propriété de la ressource (`checkCustomerOwner`, `checkCartOwner`). Vérifier côté serveur, jamais seulement dans l'interface. Prévenir les IDOR : un identifiant dans l'URL ne suffit jamais à donner accès. |
| S3 | **Mots de passe** : hachage avec sel (bcrypt/argon2), jamais journalisés ni renvoyés. |
| S4 | **Validation des entrées** : toutes les données sont validées et typées côté serveur (types, longueurs, formats). |
| S5 | **Injection SQL** : requêtes paramétrées uniquement. |
| S6 | **XSS** : échappement des données affichées, en-têtes de sécurité (`helmet`, CSP). |
| S7 | **CSRF** : cookies `SameSite` et/ou jeton anti-CSRF pour les requêtes qui modifient des données. |
| S8 | **Force brute et abus** : limitation de débit (`express-rate-limit`) sur `/auth/login`, `/auth/register` et la réinitialisation de mot de passe. |
| S9 | **CORS** : liste blanche des origines autorisées, avec `credentials` uniquement pour le frontend. |
| S10 | **Transport** : HTTPS partout en production. |
| S11 | **Erreurs** : messages génériques au client, détails techniques uniquement dans les logs serveur (pas de stack trace exposée). |
| S12 | **Secrets** : `.env` exclus de Git (`.gitignore`), identifiants de base de données différents entre développement et production. |
| S13 | **Dépendances** : `npm audit` régulier, mises à jour de sécurité. |
| S14 | **RGPD** : minimisation des données, droit d'accès, de rectification et d'effacement, mentions légales, consentement aux cookies. |
| S15 | **Tests de sécurité** : tests automatisés pour 401 (non connecté), 403 (mauvais rôle ou mauvais propriétaire) et refus des entrées invalides. |

---

## 5. Écarts constatés dans le code actuel

Points repérés en lisant les routes ; à vérifier puis corriger.

| Route | Problème possible | Story concernée |
|---|---|---|
| `GET /customer/:id`, `/:id/addresses`, `PATCH /:id`, `DELETE /:id`, routes d'adresses | Seulement `authenticate` : sans contrôle de propriété, un client pourrait lire ou modifier la fiche d'un autre. | C2, C3, C4, C6 |
| `GET /order/:customer_id`, `GET /order/detail/:order_id`, `POST /order/:customer_id` | Pas de `checkCustomerOwner` ni de vérification de propriété de la commande. | C12, C14, C15 |
| `PATCH /user/update-user/:id` | Seulement `authenticate` : vérifier qu'on ne modifie que son propre compte et pas son rôle. | C3 |
| `GET /order/` (liste admin) | Aucune route pour que l'admin liste toutes les commandes. | A6 |
| `/auth/register` | Vérifier que le rôle ne peut pas être imposé par le corps de la requête. | V8 |
