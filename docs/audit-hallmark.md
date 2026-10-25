# Audit Hallmark, Le temps d'une tasse

Audit du frontend (`frontend/src`) fait avec le skill Hallmark (`/hallmark audit all site`), le 24 octobre 2026.

- **Pages rendues:** `/` (accueil), `/collection-cafe-grain` (page catégorie), `/produit/3` (fiche produit), avec le backend et la base en marche.
- **Tailles testées:** 320, 375, 768, 1024, 1280, 1440 et 1920 px.
- **Aucun fichier du code n'a été modifié.** Seule trace: le dossier `frontend/.hallmark/` (rapport et captures) et `puppeteer-core` ajouté en devDependency.
- **Total:** 163 FAIL, 169 REFLEX, 13 avertissements sur 47 fichiers et 3 pages.

Rapport brut: `frontend/.hallmark/before.txt`. Captures: `frontend/.hallmark/before/`.

## Lecture générale

| | |
| --- | --- |
| **À quoi sert le site** | Vendre du café et du thé. L'action principale est « Ajouter au panier ». |
| **Ce qui marche** | La fiche produit (grande photo du sachet, titre Playfair Display, prix lisible, bouton vert franc), le hero de la page catégorie, la palette vert foncé et crème cohérente avec le logo, la navigation claire. |
| **Ce qui sent le généré** | Les petits titres en majuscules espacées au-dessus des titres (« ÉTHIOPIE », « CONDITIONNEMENT », « LA BOUTIQUE CAFÉ », « FRAÎCHEMENT TORRÉFIÉS »), les trois cartes avec icône, le bandeau de trois garanties répété sur chaque page, le pied de page standard avec inscription à une lettre d'information. |
| **Ce qui est cassé** | Un débordement horizontal sur mobile, le bouton « Ajouter au panier » qui passe sur 3 lignes, le focus clavier invisible sur la recherche, des textes sous le contraste minimum. |

## Priorité 1: responsive (branche `fix/responsive`)

| Règle | Où | Problème | Correction |
| --- | --- | --- | --- |
| 34 | `style.css:15` | `overflow-x: hidden` sur `html`, ce qui casse les éléments `sticky` | `overflow-x: clip` sur `html` et `body` |
| 34 | accueil, 375 px | `div.flex.flex-direction-column` dépasse de 46 px de l'écran, caché seulement par le `hidden` | l'empiler sous 60rem, retirer l'écart et les largeurs du bureau sur téléphone |
| 49a | cartes produit, 320 et 768 px | « Ajouter au panier » passe sur 3 lignes à 320 px et 2 lignes à 768 px | `white-space: nowrap` ou libellé plus court |
| 49b | cartes produit, 768 px | les noms de produit (« Yirgacheffe Aurore », « Antigua Volcan ») passent sur 2 lignes | raccourcir ou accepter 2 lignes au plus |
| 49a | page catégorie, 1024 px | les filtres « café en grain grand cru » et « café en grain biologique » passent sur 2 lignes | libellé plus court ou `nowrap` |
| 44d | page catégorie, 1920 px | le texte du hero commence à 70 px du bord, la page fait environ 3 400 px de haut | conteneur centré, largeur maximale de 1360 à 1520 px |
| 44c | page catégorie, 1440 px | le hero va jusqu'à 3 899 px, bien au-delà de l'écran de 900 px | le hero doit tenir sur un écran |

## Priorité 2: accessibilité

| Règle | Où | Problème | Correction |
| --- | --- | --- | --- |
| 26a | `input.searchBar-input` (3 pages) | aucun signe visible au focus clavier | un `:focus-visible` avec un anneau visible, instantané |
| 40 | accueil, « Notre sélection » | contraste de 2,85:1 (minimum 4,5:1) | assombrir le texte |
| 40 | accueil, `a.selection-client__more` « VOIR TOUS NOS CAFÉS » | contraste de 2,01:1 | assombrir le texte ou changer le fond |
| 40 | champ de recherche | contour à 1,00:1 contre le fond (minimum 3:1) | contour ou fond plus marqué |
| 73 | accueil et page catégorie | `p.m-bottom-5px` recouvert par un autre élément | lui donner sa place |
| 39a | `userAddresses.css:196` | bouton désactivé par l'opacité seule | ajouter `cursor: not-allowed`, la couleur et l'attribut `disabled` |
| 26b | `AuthModal.jsx` | aucun état `:active` | ajouter l'état |
| 75 | `p.letter-spacing-3px` | texte d'environ 10 px | 12 px au minimum |
| 30a | `LoginForm.jsx:74`, `RegisterForm.jsx:154`, `UserSecurity.jsx:110, 132, 155` | emoji 👁 utilisé comme icône du mot de passe | une icône de `react-icons` |

## Priorité 3: système de design (couleurs, polices, espacements)

`index.css` et `App.css` sont vides: le projet n'a aucune variable globale.

| Règle | Nombre | Problème | Correction |
| --- | --- | --- | --- |
| 48 | 99 | couleurs et polices écrites en dur (`rgba(0,0,0,0.55)`, `#fff`, `#d4b483`, `"Lato"`, `"Playfair Display"`…) | variables dans `:root` (`--color-*`, `--font-*`) |
| 7a | 10 | blanc et noir purs (`accueil.css:8, 39, 73, 148`, `cartDrawer.css:145`, `settings.css:74, 87, 88`, `userAddresses.css:37, 160`) | blanc cassé teinté vers le crème |
| 24b | 139 | espacements hors de la grille de 4 px (`gap: 30px`, `margin: 40px 50px 0 50px`…) | une échelle `--space-*` |
| 37 | 1 | six familles de polices dans `settings.css:12` (Lato, Playfair Display, Arial, Roboto, Montserrat…) | trois au maximum |
| 38ii | 1 | titre en italique, `.cart-drawer__header h2` | titre droit |
| 67 | 17 | libellés en majuscules espacées (`.selection-client__more`, `.cart-drawer__count`…) | police du texte, un cran plus petite, minuscules, sans espacement |
| 54 | 2 | sur-titres: `Selection.jsx:8` « Nos cafés en grain » et `SelectionClient.jsx:40` « Notre sélection » | supprimer ou faire du sur-titre le vrai titre |
| 10a | 1 | `cartDrawer.css:102`, `width` animée sur `.cart-shipping__fill` | animer `transform: scaleX` |
| 19 | 2 | tirets longs dans `History.jsx:30` et `Footer.jsx:64` | virgule, deux-points ou point |

## Priorité 4: composition et rythme

Ces points sont des choix de design. Ils ne seraient traités que par une refonte (`/hallmark redesign`).

- **58 (FAIL):** 180 mots sur un seul écran de l'accueil, et 9 blocs de texte dans le hero avant les actions.
- **78:** les titres de section font 24 px sous un titre de hero de 48 px.
- **59:** le plus petit espace entre deux sections est de 54 px (minimum 120 px).
- **71:** des titres plus proches de ce qui les précède que de ce qu'ils annoncent.
- **77:** `section.trustBadges` est large mais sans relief. La page catégorie n'a que 4 sections et la fiche produit 3.
- **85:** l'accueil et la page catégorie se terminent sur une inscription à la lettre d'information.
- **39b:** les champs et boutons font moins de 44 px de haut (lettre d'information, `a.product-card__button`).
- **44c:** le hero de l'accueil s'arrête à 666 px sur un écran de 900 px.

## Avertissements

- **11:** l'image des cartes produit change de taille au survol (`productPage.css:226`).
- **29:** panneau flou (`backdrop-filter`) dans la fenêtre de connexion (`authModal.css:7`).
- **41:** le pied de page produit est sombre sans couleur de texte définie (`productFooter.css:7`).
- **F4:** quatre styles de bouton principal différents (`productPage.css:365`).
- **F1:** apostrophes droites dans `History.jsx:41` et `Footer.jsx:75`.
- **F2:** trois points au lieu de « … » dans `UserAddresses.jsx:173` et `ProductDetailPage.jsx:33`.
- **F3:** aucun `text-wrap: balance` sur les 21 règles de titres.
- **F22:** texte justifié sans césure dans `settings.css:30`.

## Ordre de travail conseillé

L'ordre suit les priorités du document. Après chaque groupe, relancer le linter pour voir les FAIL disparaître.

### Priorité 1: responsive
1. `overflow-x: clip` sur `html` et `body` (`style.css:15`), puis le bloc `div.flex.flex-direction-column` qui dépasse de 46 px à 375 px.
2. Le bouton « Ajouter au panier » (`nowrap` ou libellé plus court) à 320 et 768 px.
3. Les noms de produit (768 px) et les filtres de la page catégorie (1024 px) qui passent sur 2 lignes.
4. La page catégorie à 1920 px: conteneur centré et plafonné (règle 44d), puis la hauteur du hero à 1440 px (règle 44c).

### Priorité 2: accessibilité
5. Le focus clavier de `.searchBar-input` (`:focus-visible`), puis le contour du champ (3:1 minimum).
6. Les contrastes: « Notre sélection » (2,85:1) et « VOIR TOUS NOS CAFÉS » (2,01:1).
7. Le texte recouvert (`p.m-bottom-5px`, règle 73).
8. Le bouton désactivé de `userAddresses.css:196` (règle 39a) et l'état `:active` d'`AuthModal.jsx` (règle 26b).
9. Le texte de 10 px (`p.letter-spacing-3px`, règle 75).
10. L'emoji 👁 remplacé par une icône de `react-icons` (5 endroits, règle 30a).

### Priorité 3: système de design
11. Créer les variables `:root` dans `index.css` (couleurs, polices, espacements), puis remplacer les valeurs en dur fichier par fichier (règles 48, 7a, 24b). C'est le plus long.
12. Ramener les six familles de polices de `settings.css:12` à trois au maximum (règle 37).
13. Les libellés en majuscules espacées (règle 67) et les deux sur-titres de `Selection.jsx:8` et `SelectionClient.jsx:40` (règle 54).
14. L'animation de largeur de `cartDrawer.css:102` (`transform: scaleX`, règle 10a).
15. Le titre en italique de `.cart-drawer__header h2` (règle 38ii) et les tirets longs de `History.jsx:30` et `Footer.jsx:64` (règle 19).
16. Les avertissements: zoom au survol (11), panneau flou (29), texte du pied de page produit (41), styles de bouton (F4), apostrophes et points de suspension (F1, F2), `text-wrap: balance` (F3), texte justifié (F22).

### Priorité 4: composition et rythme (à décider)
17. Ces points ne se règlent pas par petites corrections: trop de texte sur l'accueil (58), titres de section trop petits (78), espaces entre sections (59, 71), bandeau de garanties (77), fin sur la lettre d'information (85), hero de l'accueil (44c), champs trop bas (39b). Ils relèvent d'une refonte (`/hallmark redesign`), à décider une fois les étapes 1 à 16 faites.

## Limites de l'audit

- Je n'ai pas relu à l'œil chacune des règles de composition: seules celles que le linter mesure, plus ma lecture des captures.
- Les pages utilisateur (compte, adresses, connexion), le panier ouvert et les états au survol n'ont pas été rendus. Elles n'apparaissent que dans l'analyse du code.
- La page catégorie et la fiche produit ont été testées avec un seul produit (id 3).
