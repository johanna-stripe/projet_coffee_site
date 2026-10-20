# Wireframes — Le temps d'une tasse

Maquettes fil de fer du site, d'après les pages et composants du frontend (React + React Router).

## Sommaire

1. [Plan du site et routes](#1-plan-du-site-et-routes)
2. [Éléments communs (toutes les pages)](#2-éléments-communs)
3. [Page d'accueil](#3-page-daccueil-)
4. [Page catégorie (liste de produits)](#4-page-catégorie-liste-de-produits)
5. [Fiche produit](#5-fiche-produit-produitid)
6. [Modale connexion / inscription](#6-modale-connexion--inscription)
7. [Espace client](#7-espace-client-modale)
8. [Version mobile](#8-version-mobile-900-px)

Légende : `[ ]` bouton ou champ · `( )` option sélectionnable · `▓▓▓` image · `░░░` zone de contenu.

---

## 1. Plan du site et routes

| Page | Route | Composant |
|---|---|---|
| Accueil | `/` | `Accueil` |
| Café en grain | `/collection-cafe-grain` | `ProductPage` (catégorie 1) |
| Café moulu | `/collection-cafe-moulu` | `ProductPage` (catégorie 2) |
| Thé | `/collection-the` | `ProductPage` (catégorie 3) |
| Infusion | `/collection-infusion` | `ProductPage` (catégorie 4) |
| Machines à café | `/collection-machines` | `ProductPage` (catégorie 5) |
| Accessoires | `/collection-accessoires` | `ProductPage` (catégorie 6) |
| Fiche produit | `/produit/:id` | `ProductDetailPage` → `ProductDetail` |
| Connexion / inscription | modale (pas de route) | `AuthModal` |
| Espace client | modale (pas de route) | `UserAccount` |

```
Accueil ──► Catégorie (filtres ?categorie=...) ──► Fiche produit
   │
   ├──► Modale Connexion / Inscription
   └──► Modale Espace client (si connecté)
```

---

## 2. Éléments communs

Présents sur toutes les pages : bandeau, barre de navigation (en haut), bandeau de réassurance et pied de page (en bas).

### 2.1 Bandeau et barre de navigation (ordinateur)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│   Livraison offerte dès 35 € d'achat · Torréfaction artisanale française         │  ← TopBanner
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────┐  ┌──────────────────────┐   Café   Thé & Infusion   Machines        │
│  │  LOGO  │  │ Rechercher...     🔍 │   Accessoires   Qui sommes-nous ?        │
│  └────────┘  └──────────────────────┘                                ┌───────┐ │
│                                                         Bienvenue Prénom│ 👤 🧺 │ │
│                                                                        └───────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Comportements :
- Au survol de « Café », « Thé & Infusion », « Machines », « Accessoires », un **sous-menu** s'ouvre.
- « Qui sommes-nous ? » fait défiler la page jusqu'à la section Notre histoire (`#brulerie`).
- 👤 ouvre la modale de connexion (visiteur) ou l'espace client (connecté).
- Après 80 px de défilement, la barre devient **compacte** (version réduite).

### 2.2 Sous-menu (au survol)

```
        Café ▾
   ┌────────────────────────┐
   │  Café en grain         │──► /collection-cafe-grain
   │  Café moulu            │──► /collection-cafe-moulu
   └────────────────────────┘
```

Chaque sous-menu liste les sous-catégories de la rubrique et renvoie vers la page catégorie correspondante.

### 2.3 Bandeau de réassurance (avant le pied de page)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│     [icône]              │          [icône]             │         [icône]        │
│  Paiement sécurisé       │  Livraison gratuite dès 35 € │  Traçabilité & fraîcheur│
│  Transactions SSL 256    │  Expédition offerte en France│  Grains torréfiés sous │
│  bits. Visa, MC, PayPal  │  Colissimo 48h               │  48h. Origine, altitude │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Pied de page

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────┐  Brûlerie artisanale       BOUTIQUE        INFORMATIONS     RESTEZ INFORMÉ│
│  │ LOGO │  en Provence...            Café grain      Notre brûlerie   Nouveaux     │
│  └──────┘                            Café moulu      Contact          arrivages... │
│  (IG) (FB) (Pin) (TikTok)            Thé             FAQ              ┌──────────┐ │
│                                      Infusions       Mentions légales │votre@mail│ │
│                                      Accessoires     CGV              └──────────┘ │
│                                      Machines                         [S'abonner]  │
│  ────────────────────────────────────────────────────────────────────────────────  │
│  © 2024 Le temps d'une tasse — Tous droits réservés        Visa Mastercard PayPal  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Page d'accueil (`/`)

Ordre des sections : slider → sélection (3 cartes) → coups de cœur → notre histoire.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  [ TopBanner + NavBar ]                                                          │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓                                                                             ▓▓│
│ ▓▓ ❮    TORRÉFACTION ARTISANALE                                            ❯   ▓▓│  SLIDER
│ ▓▓      L'art du café en grains                                                ▓▓│  500 px, 3 slides
│ ▓▓      Sélectionnés à la source, torréfiés dans notre atelier.                ▓▓│  défilement auto 7 s
│ ▓▓      [ DÉCOUVRIR NOS CAFÉS ]                                                ▓▓│
│ ▓▓                              ● ○ ○                                          ▓▓│
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
├──────────────────────────────────────────────────────────────────────────────────┤
│                         Nos cafés en grain                                       │
│                 Trouvez le café qui vous ressemble                               │  SÉLECTION
│                                                                                  │
│   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐            │
│   │     [icône]      │   │     [icône]      │   │     [icône]      │            │
│   │ CAFÉS DE         │   │ CAFÉS BIO        │   │ CAFÉS ITALIENS   │            │
│   │ SPÉCIALITÉ       │   │                  │   │                  │            │
│   │ Description...   │   │ Description...   │   │ Description...   │            │
│   │ [ Découvrir ]    │   │ [ Découvrir ]    │   │ [ Découvrir ]    │            │
│   └──────────────────┘   └──────────────────┘   └──────────────────┘            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                              Notre sélection                                     │
│                      Nos coups de cœur du moment                                 │  COUPS DE CŒUR
│                                                                                  │  3 grains + 2 moulus
│  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐  ┌───────┐                          │  (ProductCard)
│  │ ▓▓▓▓▓ │  │ ▓▓▓▓▓ │  │ ▓▓▓▓▓ │  │ ▓▓▓▓▓ │  │ ▓▓▓▓▓ │                          │
│  │ Nom   │  │ Nom   │  │ Nom   │  │ Nom   │  │ Nom   │                          │
│  │ Prix  │  │ Prix  │  │ Prix  │  │ Prix  │  │ Prix  │                          │
│  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘                          │
│                          [ Voir tous nos cafés ]                                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│  id="brulerie"                                                                   │
│  ┌──────────────────────┐    NOTRE HISTOIRE                                      │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │    Découvrir                                           │  HISTOIRE
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │    la brûlerie                                         │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │    ───                                                 │
│  │ ▓▓▓▓▓▓▓ ┌─────────┐ │    Depuis 1998, nous sélectionnons...                  │
│  │ ▓▓▓▓▓▓▓ │  1998   │ │    (3 paragraphes)                                     │
│  │ ▓▓▓▓▓▓▓ │FONDÉE EN│ │    ──────────────────────────────                      │
│  └─────────┴─────────┴─┘      26            48h           100%                   │
│                              Origines   Après torréf.   Arabica tracé           │
├──────────────────────────────────────────────────────────────────────────────────┤
│  [ TrustBadges ]                                                                 │
│  [ Footer ]                                                                      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Navigation depuis l'accueil :
- Bouton du slider → page catégorie correspondante.
- « Découvrir » d'une carte de sélection → page café en grain, déjà filtrée (`?categorie=...`).
- Carte produit → fiche produit.

---

## 4. Page catégorie (liste de produits)

Même gabarit pour les 6 catégories. L'en-tête, les filtres et le pied de page changent selon la catégorie.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  [ TopBanner + NavBar ]                                                          │
├──────────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────┐   LA BOUTIQUE CAFÉ                            │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   Café en grains                              │  PRODUCT HEADER
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │   Des cafés de spécialité sélectionnés...     │
│  └───────────────────────────────┘                                               │
│                                                                                  │
│            FRAÎCHEMENT TORRÉFIÉS                                                 │
│            Trouvez le grain qui vous ressemble                                   │
│            Fruité et délicat, rond et gourmand ou puissant...                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│  Catégorie  (toutes) [grand cru] [biologique] [décaféiné] [italien] [vert]       │  FILTRE 1
│  Torréfaction (toutes) [moyenne] [foncée] [vert (non torréfié)]  8 produit(s)    │  FILTRE 2 + compteur
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │
│  │ [Badge cat]│  │ [Badge cat]│  │ [Badge cat]│  │ [Badge cat]│                 │
│  │            │  │            │  │            │  │            │                 │
│  │  ▓▓▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓▓▓  │                 │
│  │  ▓▓▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓▓▓  │                 │
│  │[Ajouter au │  │[Ajouter au │  │[Ajouter au │  │[Ajouter au │  ← au survol    │
│  │  panier]   │  │  panier]   │  │  panier]   │  │  panier]   │                 │
│  ├────────────┤  ├────────────┤  ├────────────┤  ├────────────┤                 │
│  │Origine Torr│  │Origine Torr│  │Origine Torr│  │Origine Torr│                 │
│  │Éthiopie Mdy│  │...         │  │...         │  │...         │                 │
│  │MARQUE      │  │            │  │            │  │            │                 │
│  │Nom produit │  │Nom produit │  │Nom produit │  │Nom produit │                 │
│  │Description │  │Description │  │Description │  │Description │                 │
│  │12,90 €  250g│ │...         │  │...         │  │...         │                 │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘                 │
│        (grille : 8 cartes « squelettes » grises pendant le chargement)           │
│                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│   01                        02                        03                         │
│   Torréfié chaque semaine   Expédié sous 48 h         À votre écoute             │  PRODUCT FOOTER
│   En petits lots...         Pour préserver...         Nos torréfacteurs...       │
├──────────────────────────────────────────────────────────────────────────────────┤
│  [ TrustBadges ]   [ Footer ]                                                    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Filtres par catégorie :

| Catégorie | Filtre 1 : Catégorie | Filtre 2 |
|---|---|---|
| Café en grain | toutes, grand cru, biologique, décaféiné, italien, vert | Torréfaction |
| Café moulu | toutes, grand cru, biologique, décaféiné, italien, chicorée | Mouture |
| Thé | toutes, en vrac, vert, noir, rouge, en sachet | — |
| Infusion | toutes, en vrac, herbes, fleurs, fruits et épices, en sachet | — |
| Machines | toutes, à grain, à expresso, italienne, à piston, électrique | Usage |
| Accessoires | toutes, accessoires café, accessoires thé, moulin, bouilloire, théière | Technologie |

États de la grille : chargement (cartes grises), erreur (« Impossible de charger les produits »), vide (« Aucun produit »).

---

## 5. Fiche produit (`/produit/:id`)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  [ TopBanner + NavBar ]                                                          │
├──────────────────────────────────────────────────────────────────────────────────┤
│  La boutique  /  Café en grain  /  Nom du produit            ← fil d'Ariane      │
│                                                                                  │
│  ┌──────────────────────────────┐    ÉTHIOPIE · ALTITUDE 2 100 M                │
│  │                              │    Nom du produit                              │
│  │      ┌──────────────┐        │    ★★★★☆ (128 avis)         ← si note en base  │
│  │      │   ▓▓▓▓▓▓▓▓   │ [Badge │    ─────────────────────────                   │
│  │      │   ▓▓▓▓▓▓▓▓   │ torréf]│    Description du produit...                   │
│  │      │   ▓▓▓▓▓▓▓▓   │        │                                                │
│  │      └──────────────┘        │    Profil aromatique                           │
│  │                              │    • Fruits rouges  • Cacao       ← si données │
│  └──────────────────────────────┘                                                │
│  Sélectionné et préparé avec soin     Conditionnement ................ 250 g     │
│  dans notre atelier en Provence                                                  │
│                                       12,90 €                  ┌───────────┐     │
│                                       En stock · expédié 48 h  │ −   1   + │     │
│                                                                └───────────┘     │
│                                       [      AJOUTER AU PANIER      ]            │
│                                       Livraison offerte dès 35 € · paiement sécurisé│
│                                                                                  │
│                                       ┌──────────┬──────────┬──────────┐         │
│                                       │   93 °C  │  4 min   │  15 g    │ ← si    │
│                                       │Température│  Durée  │  Dosage  │ données │
│                                       └──────────┴──────────┴──────────┘         │
│                                       ▾ Détails du produit                       │
│                                       ▾ Livraison & retours                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│  [ TrustBadges ]   [ Footer ]                                                    │
└──────────────────────────────────────────────────────────────────────────────────┘
```

Règles d'affichage :
- Bouton « − » désactivé à 1. Bouton « + » désactivé au stock maximum.
- Stock à 0 : « Rupture de stock » et bouton « Ajouter au panier » désactivé.
- Les blocs altitude, note, arômes et paramètres de préparation n'apparaissent que si la donnée existe en base.
- Produit introuvable : message « Produit introuvable ».

---

## 6. Modale connexion / inscription

Ouverte par l'icône 👤 quand l'utilisateur n'est pas connecté. Un clic en dehors de la modale ou sur ✕ la ferme.

### 6.1 Connexion

```
┌──────────────────────────────────────────────────┐
│                                              ✕   │
│            Bon retour parmi nous                 │
│        CONNECTEZ-VOUS À VOTRE COMPTE             │  fond foncé
│                                                  │
│            LOGIN        REGISTER                 │
│            ─────                                 │
├──────────────────────────────────────────────────┤
│  Adresse e-mail ou mot de passe invalide  ← erreur
│                                                  │
│  ADRESSE E-MAIL                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ votre@email.com                            │ │
│  └────────────────────────────────────────────┘ │
│  MOT DE PASSE                                    │
│  ┌──────────────────────────────────────┐ 👁    │
│  │ ••••••••••                           │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  [            SE CONNECTER            ]          │
│  Pas encore de compte ? Créer un compte          │
└──────────────────────────────────────────────────┘
```

### 6.2 Inscription

```
┌──────────────────────────────────────────────────┐
│                                              ✕   │
│                Rejoignez-nous                    │
│               CRÉEZ VOTRE COMPTE                 │
│            LOGIN        REGISTER                 │
│                         ────────                 │
├──────────────────────────────────────────────────┤
│  PRÉNOM                    NOM                   │
│  ┌──────────────────┐     ┌──────────────────┐  │
│  │                  │     │                  │  │
│  └──────────────────┘     └──────────────────┘  │
│  ADRESSE E-MAIL                                  │
│  ┌────────────────────────────────────────────┐ │
│  └────────────────────────────────────────────┘ │
│  TÉLÉPHONE                                       │
│  ┌────────────────────────────────────────────┐ │
│  └────────────────────────────────────────────┘ │
│  DATE DE NAISSANCE                               │
│  ┌────────────────────────────────────────────┐ │
│  └────────────────────────────────────────────┘ │
│  MOT DE PASSE                                    │
│  ┌──────────────────────────────────────┐ 👁    │
│  └──────────────────────────────────────┘       │
│  CONFIRMER LE MOT DE PASSE                       │
│  ┌──────────────────────────────────────┐ 👁    │
│  └──────────────────────────────────────┘       │
│                                                  │
│  [           CRÉER MON COMPTE           ]        │
│  Déjà un compte ? Se connecter                   │
└──────────────────────────────────────────────────┘
```

---

## 7. Espace client (modale)

Ouverte par l'icône 👤 quand l'utilisateur est connecté. Occupe 80 % de la largeur et de la hauteur de l'écran.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                              ✕   │
│                         Bienvenue Prénom Nom                                     │
├───────────────────────┬──────────────────────────────────────────────────────────┤
│                       │                                                          │
│  ℹ  Mes informations ◄─── actif                                                 │
│                       │      Contenu de l'onglet sélectionné                     │
│  📒 Mes adresses      │                                                          │
│                       │      ┌────────────────────────────────────────┐          │
│  🛒 Mes achats        │      │  Mes informations :                    │          │
│                       │      │  prénom, nom, e-mail, téléphone,       │          │
│  🔒 Sécurité          │      │  date de naissance (modifiables)       │          │
│                       │      └────────────────────────────────────────┘          │
│  ⏻  Se déconnecter    │                                                          │
│                       │                                                          │
└───────────────────────┴──────────────────────────────────────────────────────────┘
```

| Onglet | Composant | Contenu |
|---|---|---|
| Mes informations | `UserInformation` | Coordonnées du compte |
| Mes adresses | `UserAddresses` | Carnet d'adresses |
| Mes achats | `UserPuscharses` | Historique de commandes |
| Sécurité | `UserSecurity` | Mot de passe |
| Se déconnecter | — | Ferme la modale, retourne à `/`, déconnecte |

---

## 8. Version mobile (≤ 900 px)

Le menu devient un **burger**, les sous-menus s'ouvrent en accordéon au clic (pas de survol sur écran tactile), et le bouton « Ajouter au panier » reste visible sans survol.

### 8.1 Barre de navigation

```
┌──────────────────────────┐        ┌──────────────────────────┐
│ Livraison offerte dès 35€│        │ Livraison offerte dès 35€│
├──────────────────────────┤        ├──────────────────────────┤
│ ☰    [ LOGO ]      👤 🧺 │        │ ✕    [ LOGO ]      👤 🧺 │
│ ┌──────────────────────┐ │        │ ┌──────────────────────┐ │
│ │ Rechercher...     🔍 │ │        │ │ Rechercher...     🔍 │ │
│ └──────────────────────┘ │        │ └──────────────────────┘ │
└──────────────────────────┘        │  Café                  ▾ │
        menu fermé                  │    Café en grain         │
                                    │    Café moulu            │
                                    │  Thé & Infusion        ▾ │
                                    │  Machines              ▾ │
                                    │  Accessoires           ▾ │
                                    │  Qui sommes-nous ?       │
                                    └──────────────────────────┘
                                            menu ouvert
```

### 8.2 Page catégorie

```
┌──────────────────────────┐
│ [ NavBar mobile ]        │
├──────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ LA BOUTIQUE CAFÉ         │
│ Café en grains           │
│ Description...           │
├──────────────────────────┤
│ Catégorie                │
│ (toutes)(grand cru)(bio) │  ← filtres sur plusieurs lignes
│ Torréfaction             │
│ (toutes)(moyenne)(foncée)│
├──────────────────────────┤
│ ┌──────────────────────┐ │
│ │      ▓▓▓▓▓▓▓▓        │ │  1 carte par ligne
│ │ [Ajouter au panier]  │ │  (image carrée 1/1)
│ │ Nom produit          │ │
│ │ 12,90 €       250 g  │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │      ▓▓▓▓▓▓▓▓        │ │
│ └──────────────────────┘ │
├──────────────────────────┤
│ 01 Torréfié chaque semaine│
│ 02 Expédié sous 48 h     │
│ 03 À votre écoute        │
├──────────────────────────┤
│ [ TrustBadges ] [Footer] │
└──────────────────────────┘
```

---

## Fonctionnalités prévues, non maquettées

- Le **panier** (icône 🧺 et bouton « Ajouter au panier ») n'a pas encore de page ni de comportement.
- La **recherche** de la barre de navigation n'est pas encore branchée.
- Les pages **Qui sommes-nous**, **Contact**, **FAQ**, **Mentions légales** et **CGV** (liens du pied de page) n'existent pas encore.
- La route `/admin` est déclarée dans `paths.js` sans page associée.
