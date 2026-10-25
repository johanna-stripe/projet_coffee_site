# Prompt Figma - Maquette en couleurs du site café

> À copier-coller dans l'IA de Figma (tout ce qui suit cette ligne).

---

À partir des wireframes existants de ce fichier, crée la maquette haute fidélité en couleurs du même site e-commerce de café, thé et infusions. Conserve exactement la structure, les pages, les composants et les liens du prototype; applique la charte graphique ci-dessous. Garde les deux versions: Desktop (1440px) et Mobile (390px).

## AMBIANCE

Chaleureuse, artisanale et haut de gamme: épicerie fine de café et de thé. Beaucoup d'espace, tons crème et bruns, un vert profond en accent. Pas de style froid ou technologique.

PALETTE (à créer comme styles de couleur Figma)

- Crème (fond principal des pages): #F3EBD9
- Crème clair (cartes, sections alternées, modales): #FAF5EA
- Brun café (texte, titres, NavBar): #331B0A
- Brun très foncé (Footer, textes forts): #1E0F05
- Caramel (boutons principaux, liens, icônes): #905B27
- Vert sapin (accent secondaire, TrustBadges, étiquettes, bouton "Commander"): #305847
- Doré doux (survols, détails décoratifs): #D9A566
- Beige (bordures, séparateurs, champs de formulaire): #B9A98F
- Rouge (erreurs, bouton supprimer, pastille du panier): #C1121F
Contraste: le texte brun sur fond crème doit rester très lisible; texte blanc ou crème uniquement sur fond brun, caramel foncé ou vert.

## TYPOGRAPHIE

- Titres (H1, H2, noms de sections, nom du produit): Playfair Display (serif élégante), graisse 600 à 700.
- Texte, menus, boutons, prix, formulaires: Lato (sans-serif), graisse 400 pour le texte, 700 pour les boutons et les prix.
- Échelle Desktop: H1 48px, H2 32px, H3 22px, texte 16px, petit texte 14px. Mobile: H1 32px, H2 24px, H3 18px, texte 16px.
Crée les styles de texte Figma correspondants.

## COMPOSANTS

- Boutons principaux: fond caramel #905B27, texte crème, coins arrondis 6px, hauteur 48px. Survol: plus foncé. Boutons secondaires: contour caramel, fond transparent.
- Bouton "Ajouter au panier" et "Commander": fond vert sapin #305847, texte crème.
- ProductCard: fond crème clair, bordure beige fine, coins arrondis 8px, légère ombre. Photo en haut (vraie photo de produit: sachet de café, boîte de thé, tasse, machine), nom en Lato 700, marque en petit, poids, prix en brun gras, bouton "Ajouter au panier".
- TopBanner: fond vert sapin, texte crème, centré.
- NavBar: fond crème clair, logo en Playfair Display brun, liens bruns, soulignement doré au survol, icônes compte et panier en caramel, pastille de quantité rouge.
- Footer: fond brun très foncé #1E0F05, texte crème, liens en doré au survol.
- TrustBadges: fond crème clair, pictos en vert sapin, texte brun.
- CartDrawer et AuthModal: fond crème clair, fond assombri semi-transparent derrière, coins arrondis, champs avec bordure beige et focus caramel.
- Formulaires: libellés au-dessus des champs, messages d'erreur en rouge #C1121F.

## IMAGES

Remplace les rectangles gris par des photos réalistes et cohérentes (ambiance chaude, lumière douce, fond bois ou beige): grains de café, sachets, tasses de thé, infusions, machines à café, accessoires. Pour la section "Notre histoire", une photo de torréfaction ou de plantation. Hero de l'accueil: grande photo de café avec un voile brun sombre et le titre en crème par-dessus.

## PAGES

Applique ce style à toutes les pages: Accueil, Catégorie (6 catégories, même gabarit), Fiche produit, CartDrawer (plein et vide), AuthModal (Connexion et Inscription), Espace client, Qui sommes-nous, Admin. Pour l'Admin, utilise un style plus sobre (tableau clair, boutons caramel et rouge) tout en gardant la même palette.

## CONSIGNES

- Utilise des variables et des styles Figma pour les couleurs et les textes, ainsi que des composants réutilisables, pour que tout soit modifiable d'un seul endroit.
- Garde les interactions du prototype (navigation, ouverture du panier et de la modale).
- Marges latérales Desktop: 40px minimum, contenu centré sur 1440px maximum. Grille de 12 colonnes (Desktop), 4 colonnes (Mobile).
- Nomme les frames comme dans les wireframes, avec le suffixe " - Maquette".
