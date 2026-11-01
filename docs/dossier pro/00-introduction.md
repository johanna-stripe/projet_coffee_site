# Dossier de projet : Le temps d'une tasse

Titre visé : Développeur web et web mobile (DWWM)
Projet : site e-commerce d'une brûlerie artisanale de café, thé et infusions
Candidate : Johanna Stripe
Dépôt : https://github.com/johanna-stripe/projet_coffee_site

> **À relire avant le rendu.** Les passages entre crochets `[À COMPLÉTER]`, `[CAPTURE]` ou `[À FAIRE]` sont des trous que je ne peux pas remplir à ta place (une capture d'écran, une info perso, une vérification sur ta machine). Cherche `[` dans chaque fichier pour les retrouver.

---

## Sommaire

| Fichier | Contenu |
|---|---|
| `00-introduction.md` | Cette page : présentation, projet, contexte, objectifs |
| `01-cadrage-organisation.md` | 1. Cadrage et organisation (cahier des charges, user stories, planning, environnement) |
| `02-maquettage-conception.md` | 2. Maquettage et conception (charte, wireframes, maquettes, MCD/MLD/MPD) |
| `03-backend.md` | 3. Développement du back-end (MVC, SQL, sécurité) |
| `04-frontend.md` | 4. Développement du front-end (architecture, intégration, React) |
| `05-tests-deploiement.md` | 5. Tests, déploiement et veille |
| `06-conclusion-annexes.md` | Difficultés, bilan, perspectives, annexes |

---

## Présentation personnelle

Je m'appelle Johanna Stripe. Je prépare le titre professionnel de développeur web et web mobile à Toulon, et ce site est mon projet de fin de parcours.

[À COMPLÉTER : ton parcours avant la formation, en 4 ou 5 lignes. Ce qui t'a amenée au développement, ce que tu faisais avant, un mot sur ta façon de travailler.]

Quand j'ai commencé ce projet, j'avais environ six mois de pratique. Ça se voit dans le code : certains fichiers sont très commentés (je note ce que je viens de comprendre pour ne pas l'oublier), d'autres sont plus secs parce que j'étais pressée. J'ai choisi de ne pas tout lisser dans ce dossier. Je préfère montrer ce que j'ai vraiment fait, y compris ce qui reste bancal.

---

## Le projet : Le temps d'une tasse

### Le contexte

*Le temps d'une tasse* est une brûlerie artisanale imaginaire, installée en Provence et fondée en 1998. Elle vend du café en grain et moulu, du thé, des infusions, des machines et des accessoires. Le site doit permettre à un client de parcourir le catalogue, de créer un compte, de remplir un panier et, à terme, de commander. Il doit aussi permettre à une administratrice de gérer les produits, les marques et les comptes.

L'idée qui revient dans toute la charte graphique : le café est un moment, une parenthèse. Le nom du site le dit déjà. J'ai essayé que le code et le design suivent cette idée, avec peu de texte par écran, des couleurs chaudes et des animations discrètes.

### Les objectifs

| Objectif | Où le dossier en parle |
|---|---|
| Un catalogue lisible, avec filtres par catégorie et par caractéristique | partie 4 |
| Un compte client sécurisé (inscription, connexion, profil, adresses) | partie 3 |
| Un panier lié au compte, avec la livraison offerte dès 35 € | parties 3 et 4 |
| Un back-office par rôle (ADMIN) pour produits, marques, catégories, utilisateurs | partie 3 |
| Un site utilisable sur téléphone | partie 4 |
| Un déploiement reproductible avec Docker | partie 5 |

### Ce qui est fait et ce qui ne l'est pas

Pour que le jury sache à quoi s'attendre, voici l'état réel au moment où j'écris (31 octobre 2026) :

- **Fait et fonctionnel** : catalogue (6 catégories, sous-catégories, filtres), fiche produit, inscription et connexion avec cookie JWT, panier complet (ajout, quantité, suppression, seuil de livraison offerte), espace client avec profil et adresses, rôles et middlewares, déploiement Docker.
- **Fait côté API, pas encore branché côté interface** : les routes de commande (`/order`), la gestion admin des produits, des marques et des utilisateurs. L'API existe et se teste avec Postman. Il n'y a pas d'écran d'administration.
- **Pas fait** : paiement en ligne, recherche par mot-clé, pages légales (mentions, politique de confidentialité, cookies), mot de passe oublié, email de confirmation.

Je détaille ça dans la conclusion. Je préfère l'écrire ici franchement plutôt que laisser le jury le découvrir en cliquant.
