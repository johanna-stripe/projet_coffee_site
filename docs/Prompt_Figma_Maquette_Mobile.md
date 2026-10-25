# Prompt Figma - Maquette mobile du site café

> À copier-coller dans l'IA de Figma (tout ce qui suit cette ligne).

---

À partir de la maquette Desktop en couleurs de ce fichier, crée la version Mobile haute fidélité du même site e-commerce de café, thé et infusions. Garde exactement la même charte graphique, les mêmes composants et les mêmes pages; adapte-les au format téléphone et relie-les dans un prototype cliquable.

## FORMAT

- Frames de 390 x 844 px (iPhone 14), orientation portrait, contenu en colonne unique avec défilement vertical.
- Marges latérales de 16px, grille de 4 colonnes avec gouttière de 16px.
- Zones tactiles d'au moins 44 x 44 px. Boutons principaux en pleine largeur, hauteur 48px.
- Aucun défilement horizontal.

CHARTE (identique à la maquette Desktop, via les mêmes styles et variables Figma)

- Couleurs: crème #F3EBD9 (fond), crème clair #FAF5EA (cartes, modales), brun café #331B0A (texte), brun très foncé #1E0F05 (Footer), caramel #905B27 (boutons, liens), vert sapin #305847 (accent, "Ajouter au panier", "Commander"), doré #D9A566, beige #B9A98F (bordures), rouge #C1121F (erreurs, pastille panier).
- Polices: Playfair Display pour les titres, Lato pour le reste.
- Échelle Mobile: H1 32px, H2 24px, H3 18px, texte 16px, petit texte 14px.

## STRUCTURE MOBILE COMMUNE

1. TopBanner: bandeau vert sapin fin avec message court sur une ligne.
2. Header fixe en haut: icône burger à gauche, logo centré en Playfair Display, icône compte et icône panier (avec pastille rouge de quantité) à droite.
3. Menu burger: panneau plein écran qui s'ouvre depuis la gauche, fond crème clair, liste des catégories (Café en grain, Café moulu, Thé, Infusion, Machines à café, Accessoires, Qui sommes-nous). Chaque catégorie se déplie en accordéon pour montrer ses sous-catégories. Croix de fermeture en haut.
4. TrustBadges: 2 colonnes x 2 lignes.
5. Footer: fond brun très foncé, liens en accordéons repliables (Boutique, Informations, Compte), mentions légales et réseaux sociaux en bas.

PAGES À CRÉER (une frame par page, plus les états indiqués)
1. Accueil: hero photo avec voile brun et titre en crème, bouton "Découvrir" pleine largeur; "Notre sélection" en carrousel horizontal de ProductCards (1,5 carte visible); "Sélection client" idem; "Notre histoire" avec photo en haut et texte dessous; TrustBadges; Footer.
2. Catégorie (même gabarit pour les 6 catégories): titre en Playfair, fil d'Ariane réduit; barre avec boutons "Filtres" et "Trier"; grille de ProductCards sur 2 colonnes (image, nom, marque, poids, prix, bouton "Ajouter"). États: panneau de filtres ouvert (feuille qui monte depuis le bas avec sous-catégorie, marque, origine, prix, boutons "Appliquer" et "Réinitialiser"), et feuille de tri.
3. Fiche produit: image en haut (galerie à points), nom, marque, prix, origine, poids, description courte, sélecteur de quantité, barre "Ajouter au panier" fixée en bas de l'écran; dessous description détaillée en accordéons et produits similaires en carrousel.
4. Panier (CartDrawer): panneau plein écran depuis la droite; articles avec miniature, nom, origine, poids, quantité (- 1 +), prix, bouton supprimer; sous-total et bouton "Commander" fixé en bas. Variante "panier vide" avec illustration et bouton "Continuer mes achats".
5. Connexion / Inscription (AuthModal): feuille qui monte du bas, quasi plein écran, deux onglets, champs pleine largeur, messages d'erreur en rouge. Une variante avec erreur affichée.
6. Espace client: menu en liste (Mes informations, Mes adresses, Mes achats, Sécurité) qui ouvre chaque section en page séparée avec flèche de retour; "Mes achats" en cartes de commande (date, statut, total).
7. Qui sommes-nous: titre, photo, texte, valeurs en 3 blocs empilés.
8. Admin: tableau remplacé par une liste de cartes (nom, catégorie, prix, stock, boutons Modifier et Supprimer), bouton "Ajouter un produit" en bas, formulaire en pleine page.

## PROTOTYPE INTERACTIF

- Burger → ouvre le menu (animation "move in" depuis la gauche); croix → ferme.
- Catégorie du menu → page catégorie correspondante.
- Logo → Accueil.
- Clic sur une ProductCard → Fiche produit.
- "Ajouter au panier" → ouvre le panier (animation depuis la droite). Icône panier → idem.
- Boutons "Filtres" et "Trier" → feuilles qui montent du bas; "Appliquer" → ferme.
- Icône compte → AuthModal; après connexion → Espace client.
- Accordéons du menu et du Footer interactifs (déplier / replier).

## CONSIGNES

- Réutilise les composants Desktop en créant des variantes Mobile (Component Variants) plutôt que de tout redessiner.
- Utilise l'Auto Layout et les contraintes pour que les frames s'adaptent aussi à 360px et 430px de large.
- Nomme les frames dans une section "Mobile": "01 - Accueil - Mobile", "02 - Catégorie - Mobile", etc.
