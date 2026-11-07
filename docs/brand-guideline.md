# Le temps d'une tasse, standards de marque

Ce guide réunit tout ce qui fait l'identité du site: la marque, la voix, le logo, la couleur, la typographie, les composants, les images et le mouvement. Il est construit à partir du code du frontend (`frontend/src/style/style.css`, composants), de `docs/Prompt_Figma_Maquette.md` et de `docs/audit-hallmark.md`. Sa forme s'inspire des standards de marque de Herman Miller: des sections numérotées, une phrase d'introduction, quatre principes, des comportements nommés, des « ne pas » et des exemples en situation.

**Sommaire**

1. Marque
2. Voix
3. Logo
4. Couleur
5. Typographie
6. Composants
7. Images et icônes
8. Mise en page
9. Mouvement
10. En situation
11. Écarts avec le code actuel

---

## 1. Marque

### 1.0 Aperçu

Le temps d'une tasse est une brûlerie artisanale de café, thé et infusions, installée en Provence et fondée en 1998. Le site vend en ligne; son action principale est « Ajouter au panier ».

| | |
| --- | --- |
| **Catégories** | Café en grain, café moulu, thé, infusions, accessoires, machines |
| **Promesse** | Grains choisis à la source, torréfiés en petits lots, expédiés sous 48 h |
| **Idée centrale** | Le café est un moment, une parenthèse, un rituel |
| **Ambiance** | Épicerie fine: chaleureuse, artisanale, haut de gamme |

### 1.1 Principes

Quatre principes guident chaque décision, de la photo au bouton. Ensemble, ils veillent à ce que la marque reste chaleureuse sans jamais devenir bruyante.

| Principe | Se traduit par |
| --- | --- |
| **Prendre le temps** | De l'espace, peu de texte, un message fort par écran |
| **Rester concret** | L'origine, l'altitude, le profil aromatique, le délai: des faits, jamais de superlatifs |
| **Soigner le geste** | Des détails nets: alignements, contrastes, états de chaque bouton |
| **Réchauffer sans bruit** | Crème, brun et caramel; un seul accent vert; un mouvement discret |

### 1.2 Ce que nous sommes

| Nous sommes | Nous ne sommes pas |
| --- | --- |
| Posés, soignés, précis sur l'origine | Pressés, criards, promotionnels |
| Chaleureux et simples | Froids, techniques, jargonneux |
| Fiers du savoir-faire, sans prétention | Snob ou condescendants |

---

## 2. Voix

### 2.0 Aperçu

La voix du site est celle d'un torréfacteur qui explique son travail à un client curieux: simple, précise, sans emphase.

### 2.1 Principes

| Principe | Règle |
| --- | --- |
| **Vouvoyer** | Phrases courtes, ton chaleureux |
| **Dire le moment** | Parler du rituel et de la parenthèse, pas de la caféine |
| **Prouver par le réel** | 1998, 48 h après torréfaction, Provence, livraison offerte dès 35 €. Aucun chiffre, avis ou logo inventé |
| **Guider** | Un bouton = un verbe court (« Ajouter au panier », « Commander ») |

### 2.2 Écriture

- Titres en minuscules avec majuscule initiale, accents conservés: « Trouvez le café qui vous ressemble ».
- Un seul mot en italique, réservé au titre « Découvrir *la brûlerie* ».
- Erreurs: dire ce qui ne va pas et comment le corriger, sans reproche.

### 2.3 Ne pas

- Ne pas écrire de superlatifs vides (« le meilleur café du monde »).
- Ne pas empiler des majuscules espacées au-dessus d'un titre.
- Ne pas justifier le texte courant.

### 2.4 Phrases de référence

- « Brûlerie artisanale en Provence. Grains sélectionnés à la source, torréfiés avec soin, livrés dans leur fraîcheur. »
- « Livraison offerte dès 35 € d'achat. Torréfaction artisanale française. »
- « Traçabilité et fraîcheur. Grains torréfiés sous 48 h. Origine, altitude et profil aromatique garantis. »

---

## 3. Logo

### 3.0 Aperçu

Le logo associe une tasse et une horloge: le temps d'une tasse. Une montre à gousset repose dans le café, sur une soucoupe vert sapin. Les fichiers actifs sont dans `frontend/src/assets/images/logos/`; les anciennes versions sont rangées dans `old-version/` et ne servent plus.

### 3.1 Versions

| Version | Fichier | Format | Usage |
| --- | --- | --- | --- |
| **Logo complet** (tasse + « Le temps d'une tasse ») | `leTempsDuneTasse_logo.png` | 1920 × 1080, fond transparent | NavBar, en-têtes, documents, présentation. Sur fond clair uniquement |
| **Tasse seule**, couleur | `leTempsDuneTasse_logo_2.png` | 789 × 1080, fond transparent | Footer, petits formats, avatar, favicon (à recadrer en carré) |
| **Tasse seule**, crème | `cup_beige 1.png` | 1024 × 1024, fond transparent | Fonds brun très foncé, brun café ou vert sapin |
| **Tasse seule**, blanche (au trait) | `cup_white.png` | 1024 × 1024, fond transparent | Fonds foncés ou photo voilée, quand un blanc pur est nécessaire |

Les deux fichiers `cup_*` ont la tasse centrée dans la moitié basse d'un carré: la marge du haut est incluse dans l'image et doit être recadrée avant usage.

### 3.2 Couleurs du logo

Le logo n'utilise que trois couleurs de la palette (section 4):

| Élément | Couleur |
| --- | --- |
| Tasse, texte « Le temps » et « tasse » | Brun café `#331B0A` |
| Montre à gousset, « d'une » en écriture manuscrite | Caramel `#905B27` |
| Soucoupe | Vert sapin `#305847` |

### 3.3 Déclinaisons par fond

| Fond | Logo à utiliser |
| --- | --- |
| Crème `#F3EBD9`, crème clair `#FAF5EA`, blanc | Logo complet ou tasse couleur |
| Brun très foncé `#1E0F05`, brun café `#331B0A`, vert sapin `#305847` | Tasse crème (`cup_beige 1.png`) |
| Photo ou hero avec voile brun | Tasse crème ou tasse blanche |
| Caramel `#905B27` | Tasse crème; ne jamais poser la tasse couleur |

Il n'existe pas encore de logo complet (avec le texte) pour fond foncé, ni de version monochrome brune, ni de version vectorielle (SVG). À produire (voir section 11).

### 3.4 Texte du logo

Le texte du logo (« Le temps » et « tasse » en capitales grasses condensées, « d'une » en écriture manuscrite caramel) est dessiné dans l'image. Il n'est pas une police du site: ne pas le retaper en CSS. Pour écrire le nom de la marque en texte courant, utiliser Playfair Display (section 5). La NavBar affiche aujourd'hui le logo complet en image.

### 3.5 Zone de protection et taille minimale

- Laisser autour du logo au moins la hauteur de la montre. Aucun texte ni bord d'image dans cette zone.
- Logo complet: 120 px de large au minimum (écran), 30 mm (impression).
- Tasse seule: 32 px de haut au minimum. En dessous, l'horloge devient illisible.
- Valeurs proposées, à ajuster après essai.

### 3.6 Ne pas

- Ne pas déformer, pivoter ni recolorer le logo.
- Ne pas ajouter d'ombre ni de contour.
- Ne pas placer le logo couleur sur un fond foncé ni sur une photo chargée sans voile.
- Ne pas séparer la montre de la tasse, ni retirer la soucoupe verte.
- Ne pas utiliser les anciennes versions de `old-version/` (horloge seule, image Gemini).
- Ne pas garder le favicon de Vite: le remplacer par la tasse.

---

## 4. Couleur

### 4.0 Aperçu

La palette est chaude et terreuse. Le crème porte la page, le brun porte le texte, le caramel porte l'action, le vert sapin sert d'accent. Ces cinq couleurs sont celles du logo et des variables CSS de `frontend/src/style/style.css`.

### 4.1 Palette principale

| Nom | HEX | RGB | Variable | Rôle |
| --- | --- | --- | --- | --- |
| Crème | `#F3EBD9` | 243, 235, 217 | `--color-primary` | Fond des pages |
| Brun café | `#331B0A` | 51, 27, 10 | `--color-secondary` | Texte, titres, NavBar |
| Caramel | `#905B27` | 144, 91, 39 | `--color-tertiary` | Boutons principaux, liens, icônes |
| Vert sapin | `#305847` | 48, 88, 71 | `--color-quaternary` | Accent, TrustBadges, « Commander » |
| Brun très foncé | `#1E0F05` | 30, 15, 5 | `--color-fifth` | Footer, textes forts |

### 4.2 Palette secondaire

| Nom | HEX | RGB | Rôle | État |
| --- | --- | --- | --- | --- |
| Crème clair | `#FAF5EA` | 250, 245, 234 | Cartes, modales, sections alternées | à déclarer en variable |
| Doré doux | `#D9A566` | 217, 165, 102 | Survols, soulignements, détails décoratifs | à déclarer en variable |
| Beige | `#B9A98F` | 185, 169, 143 | Bordures, séparateurs, champs | à déclarer en variable |
| Rouge | `#C1121F` | 193, 18, 31 | Erreurs, suppression, pastille du panier | à déclarer en variable |

Noms de variables proposés: `--color-surface` (crème clair), `--color-gold` (doré), `--color-border` (beige), `--color-danger` (rouge).

### 4.3 Proportions

Environ 60 % crème, 25 % brun, 10 % caramel, 5 % vert et doré. Le vert accompagne; il ne couvre jamais une page entière.

### 4.4 Contraste

Texte brun sur crème pour tout le texte courant. Texte crème ou blanc uniquement sur brun, caramel foncé ou vert. Viser 4,5:1 pour le texte et 3:1 pour les contours de champs et les icônes.

Rapports mesurés (WCAG):

| Texte / élément | Fond | Rapport | Verdict |
| --- | --- | --- | --- |
| Brun café | Crème | 13,6:1 | Tout usage |
| Crème | Brun très foncé | 15,7:1 | Tout usage |
| Crème | Vert sapin | 6,8:1 | Tout usage |
| Crème | Caramel | 4,8:1 | Texte courant accepté, à surveiller en petit corps |
| Caramel | Crème clair | 5,2:1 | Liens et boutons |
| Rouge | Crème clair | 5,7:1 | Messages d'erreur |
| Doré | Brun très foncé | 8,5:1 | Liens du Footer, soulignements |
| Doré | Crème | 1,9:1 | **Décoratif seulement**, jamais du texte |
| Beige | Crème clair | 2,1:1 | **Sous 3:1**: bordure de champ à foncer ou à doubler |

### 4.5 Ne pas

- Ne pas écrire une couleur en dur dans le CSS: passer par une variable.
- Ne pas mélanger caramel et vert dans un même bouton.
- Ne pas utiliser de dégradé violet ou bleu.
- Ne pas utiliser le violet `#863BFF` du favicon de Vite: il n'appartient pas à la marque.

---

## 5. Typographie

### 5.0 Aperçu

Deux familles seulement: une serif élégante pour la voix de la marque, une sans-serif lisible pour tout le reste. Toutes deux sont libres (Google Fonts).

### 5.1 Familles

| Rôle | Police | Graisse | Repli |
| --- | --- | --- | --- |
| Titres, noms de section, nom du produit, nom de la marque en texte | **Playfair Display** | 600 et 700 | Georgia, serif |
| Texte, menus, boutons, prix, formulaires | **Lato** | 400 texte, 700 boutons et prix | system-ui, sans-serif |

Chargement recommandé, une seule fois dans `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
```

```css
:root {
    --font-heading: "Playfair Display", Georgia, serif;
    --font-body: "Lato", system-ui, sans-serif;
}
```

### 5.2 Échelle

| Style | Police | Desktop | Mobile | Graisse | Interligne |
| --- | --- | --- | --- | --- | --- |
| H1 | Playfair Display | 48 px | 32 px | 700 | 1,15 |
| H2 | Playfair Display | 32 px | 24 px | 700 | 1,2 |
| H3 | Playfair Display | 22 px | 18 px | 600 | 1,3 |
| Texte | Lato | 16 px | 16 px | 400 | 1,6 |
| Bouton, prix | Lato | 16 px | 16 px | 700 | 1,2 |
| Petit texte, légende | Lato | 14 px | 14 px | 400 | 1,5 |

Interlignes proposés, à ajuster à l'usage.

### 5.3 Comportements

- Un titre garde une seule graisse et une seule couleur.
- Étiquettes, menus, légendes: Lato, minuscules avec initiale, sans espacement de lettres.
- Texte courant aligné à gauche, 70 caractères par ligne au plus.
- Les prix s'écrivent « 12,90 € », virgule et espace avant le symbole.

### 5.4 Ne pas

- Ne pas ajouter une troisième famille (Montserrat, Roboto, Lucida Sans, Arial à retirer).
- Ne pas descendre sous 14 px.
- Ne pas mettre un mot d'un titre en italique, sauf « la brûlerie ».
- Ne pas imiter les capitales condensées du logo dans le texte du site.

---

## 6. Composants

### 6.0 Aperçu

Les composants sont sobres: coins légèrement arrondis, bordures fines, peu d'ombre. Chaque contrôle a huit états (repos, survol, focus, actif, désactivé, chargement, erreur, succès) et un `:focus-visible` immédiat.

### 6.1 Boutons

| Bouton | Style |
| --- | --- |
| Principal | Fond caramel, texte crème, coins 6 px, hauteur 48 px, survol plus foncé |
| Secondaire | Contour caramel, fond transparent |
| Ajouter au panier, Commander | Fond vert sapin, texte crème |
| Supprimer | Rouge `#C1121F` |

### 6.2 Cartes et bandeaux

| Composant | Style |
| --- | --- |
| ProductCard | Fond crème clair, bordure beige, coins 8 px, légère ombre. Photo en haut, nom Lato 700, marque en petit, poids, prix en brun gras |
| TopBanner | Fond vert sapin, texte crème, centré |
| TrustBadges | Trois garanties: paiement sécurisé, livraison dès 35 €, traçabilité et fraîcheur |

### 6.3 Navigation

| Composant | Style |
| --- | --- |
| NavBar | Fond crème clair, logo Playfair brun, soulignement doré au survol, icônes compte et panier caramel, pastille de quantité rouge |
| Footer | Fond brun très foncé, texte crème, liens dorés au survol, quatre réseaux sociaux |

### 6.4 Surfaces et formulaires

| Composant | Style |
| --- | --- |
| CartDrawer, AuthModal | Fond crème clair, voile sombre semi-transparent, coins arrondis |
| Champs | Libellé au-dessus, bordure beige, focus caramel, erreur en rouge sous le champ |

### 6.5 Ne pas

- Ne pas mettre une carte dans une carte.
- Ne pas utiliser deux styles de bouton principal sur une même page.
- Ne pas retirer l'anneau de focus.

---

## 7. Images et icônes

### 7.0 Aperçu

Le site montre le vrai produit, grand et chaud. Les images font l'ambiance; le texte reste court.

### 7.1 Principes

| Principe | Règle |
| --- | --- |
| **Lumière douce** | Fond bois ou beige, jamais gris froid |
| **Produit réel** | Sachet, grains, tasse, infusion, machine, accessoire |
| **Lieu vrai** | Torréfaction ou plantation pour « Notre histoire » |
| **Voile utile** | Hero: photo de café avec voile brun et titre crème |

### 7.2 Icônes

Les SVG de `frontend/src/assets/icons/` (panier, compte, recherche, pin, cadenas, bouclier, camion, étoile, déconnexion, trois pictos de sélection) suivent un trait simple d'épaisseur constante. Caramel ou vert sur fond clair, crème sur fond foncé. Les réseaux sociaux viennent de `react-icons`.

### 7.3 Ne pas

- Ne pas utiliser d'illustration dessinée ni d'emoji comme icône.
- Ne pas laisser de rectangle gris à la place d'une photo.
- Ne pas oublier le texte alternatif en français.

---

## 8. Mise en page

### 8.0 Aperçu

Le contenu est centré dans un conteneur plafonné; sur grand écran, ce sont les marges qui grandissent, pas la mesure.

### 8.1 Grille

| | Valeur |
| --- | --- |
| Marges latérales | 40 px minimum (`--page-gutter`) |
| Largeur maximale | 1440 px, centrée |
| Colonnes | 12 sur desktop, 4 sur mobile |
| Tailles à tester | 320, 375, 768, 1024, 1280, 1440, 1920 px |

### 8.2 Rythme

Un message fort par écran. Six à neuf sections par page. Les sections alternent crème et crème clair pour respirer.

### 8.3 Ne pas

- Ne pas faire dépasser le contenu à droite sur mobile (`overflow-x: clip` sur `html` et `body`).
- Ne pas laisser un hero plus haut qu'un écran.
- Ne pas couper un libellé de bouton sur plusieurs lignes.

---

## 9. Mouvement

### 9.0 Aperçu

Le mouvement ajoute une couche à l'identité, sans jamais distraire de l'achat. Il est calme, comme le geste de verser une tasse.

### 9.1 Principes

Quatre principes, un comportement chacun.

| Principe | Se traduit par | Comportement |
| --- | --- | --- |
| **Prendre le temps** | Accélérer doucement, ralentir à l'arrivée | Adoucissement (easing) |
| **Informer simplement** | Un mouvement clair, un sens, une intention | Précision |
| **Soutenir le contenu** | Apparaître sans masquer le produit | Opacité |
| **Respirer** | Laisser un temps de repos entre deux actions | Rythme |

### 9.2 Courbes

Toute animation utilise une courbe ajustée, jamais linéaire. La courbe se lit en trois temps: l'élan qui monte, l'action rapide, la résolution qui s'apaise.

Valeurs de départ proposées (à ajuster à l'usage):

| Usage | Durée | Courbe |
| --- | --- | --- |
| Survol, focus, couleur | 150 à 200 ms | `ease-out` |
| Apparition d'un élément, carte | 250 à 350 ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| CartDrawer, AuthModal | 300 à 400 ms | `cubic-bezier(0.22, 1, 0.36, 1)` |

### 9.3 Application

Le mouvement sert deux cas: la **transition d'une surface** (panier, modale, sous-menu) et le **retour d'un contrôle** (survol, pression, ajout au panier).

### 9.4 Comportements

| Comportement | Utilisation |
| --- | --- |
| Le panier glisse depuis la droite | Ouverture du CartDrawer |
| La modale apparaît en fondu et monte légèrement | AuthModal |
| Le soulignement doré se dessine | Survol d'un lien de la NavBar |
| La carte se soulève de quelques pixels | Survol d'une ProductCard |
| La pastille du panier pulse une fois | Après un ajout |
| Le slider défile en fondu | Hero de l'accueil |

### 9.5 Ne pas

- Ne pas faire une action trop longue (plus de 500 ms).
- Ne pas faire une action trop brusque (moins de 100 ms).
- Ne pas utiliser de courbe linéaire.
- Ne pas animer `width`, `height`, `top` ou `left`; utiliser `transform` et `opacity`.
- Ne pas écrire `transition: all`.
- Prévoir un repli `prefers-reduced-motion: reduce` et un contenu visible sans animation.

---

## 10. En situation

### 10.0 Aperçu

Ces ensembles montrent la charte appliquée. Ils servent de références quand on crée une nouvelle page.

| Situation | Ce qu'il faut voir |
| --- | --- |
| **Accueil** | TopBanner verte, NavBar crème clair, hero photo avec voile brun et titre crème, « Trouvez le café qui vous ressemble », coups de cœur, « Découvrir la brûlerie », TrustBadges, Footer brun |
| **Page catégorie** | Hero court qui tient sur un écran, filtres sur une ligne, grille de ProductCards |
| **Fiche produit** | Grande photo du sachet, titre Playfair, prix lisible, bouton « Ajouter au panier » vert |
| **Panier** | Tiroir crème clair, voile derrière, bouton « Commander » vert, état vide soigné |
| **Connexion, inscription** | Modale crème clair, champs à bordure beige, erreurs rouges explicites |
| **Espace client** | Même palette, ton plus sobre, tableaux clairs |

---

## 11. Écarts avec le code actuel

À corriger pour que le site suive ce guide.

1. **Police du corps**: `body` utilise Lucida Sans au lieu de Lato. Lato et Playfair ne sont chargées que depuis `cartDrawer.css`, `productDetail.css` et `productPage.css`, en graisses limitées (Lato 300/400, Playfair 400). Les charger une fois dans `index.html` avec Lato 400/700 et Playfair 600/700.
2. **Polices inutiles**: Montserrat et Roboto (`index.html`) et Arial; à retirer si elles ne servent pas.
3. **Taille de base**: `html { font-size: 12px !important }` donne un texte sous les 16 px visés.
4. **Couleurs en dur**: `#c1121f`, `#b9a98f`, `#d9a566`, `#faf5ea`, `#780000`, `#fa8578`, `#a33a2a`, `#dfdcc7`, `#d4b483`, `#003049`. Déclarer les quatre couleurs secondaires et supprimer les autres.
5. **Étiquettes en majuscules espacées**: « Notre Histoire », « Fondée en », titres du Footer, titres de sélection.
6. **Texte justifié** dans « Notre histoire ».
7. **Favicon** de Vite à remplacer.
8. **Logos**: les anciennes versions sont déjà rangées dans `old-version/` (suppression à valider dans git). Restent à produire: logo complet pour fond foncé, version monochrome brune, SVG de la tasse, favicon carré. `cup_beige 1.png` (espace dans le nom) à renommer en `cup_beige.png`. Footer et NavBar utilisent encore `logo_2.png` et `logo.png`; vérifier que le Footer (fond `b-primary`, crème) correspond bien au « brun très foncé » décrit en 6.3.
8 bis. **Beige sur crème clair**: 2,1:1 pour les bordures de champs, sous les 3:1 visés.
9. **Fichier parasite**: `src/style/productPage.css~` est suivi par git.
10. **Accessibilité** (détail dans `docs/audit-hallmark.md`): focus invisible sur la recherche, contrastes à 2,85:1 et 2,01:1, débordement horizontal sur mobile, « Ajouter au panier » sur 3 lignes à 320 px.
11. **Mouvement**: durées et courbes ci-dessus sont des propositions; vérifier les transitions existantes dans les feuilles de style.
12. **Chiffres de « Notre histoire »** (26 origines, 48 h, 100 % arabica): à confirmer comme réels avant mise en ligne.
