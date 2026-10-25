# Prompt Figma - Wireframes du site café

> À copier-coller dans l'IA de Figma (tout ce qui suit cette ligne).

---

Crée des wireframes basse fidélité, interactifs et reliés entre eux dans un prototype cliquable, pour un site e-commerce français de café, thé et infusions (boutique en ligne grand public).

## STYLE

- Wireframe pur: niveaux de gris uniquement (fond blanc, blocs gris clair, texte gris foncé), aucune couleur, aucune vraie photo.
- Images = rectangles gris avec une croix ou le mot "Image".
- Textes en français. Police sans-serif simple. Une seule couleur d'accentuation: un gris foncé pour les boutons principaux.
- Composants réutilisables (TopBanner, NavBar, Footer, ProductCard, TrustBadges, CartDrawer).
- Deux versions de chaque page: Desktop (1440px) et Mobile (390px).

## ÉLÉMENTS COMMUNS À TOUTES LES PAGES

1. TopBanner: bandeau fin en haut avec un message promo (ex. "Livraison offerte dès 49 €").
2. NavBar: logo à gauche, menu de catégories au centre (Café en grain, Café moulu, Thé, Infusion, Machines à café, Accessoires, Qui sommes-nous), à droite icône compte et icône panier avec pastille de quantité. Au survol d'une catégorie, un sous-menu liste les sous-catégories. Sur mobile: menu burger.
3. TrustBadges: bande de 3 à 4 pictos avec texte court (livraison rapide, paiement sécurisé, service client, produits sélectionnés).
4. Footer: colonnes de liens (boutique, informations, compte), mentions légales, réseaux sociaux.

## PAGES À CRÉER

1. Accueil (/):
   - Slider/hero avec titre, sous-titre et bouton "Découvrir".
   - Section "Notre sélection": grille de 4 ProductCards.
   - Section "Sélection client": grille de 4 ProductCards (les préférés des clients).
   - Section "Notre histoire": image à gauche, texte à droite, bouton "Qui sommes-nous".
2. Page catégorie (/collection-cafe-grain, même gabarit pour les 6 catégories):
   - Titre de la catégorie + fil d'Ariane.
   - Colonne de filtres à gauche (sous-catégorie, marque, origine, fourchette de prix) et tri en haut à droite (prix croissant/décroissant). Sur mobile: bouton "Filtres" qui ouvre un panneau.
   - Grille de ProductCards: image, nom, marque, poids, prix, bouton "Ajouter au panier".
3. Fiche produit (/produit/:id):
   - Fil d'Ariane.
   - À gauche: grande image du produit. À droite: nom, marque, prix, origine, poids, description courte, sélecteur de quantité (- 1 +), bouton "Ajouter au panier".
   - Dessous: description détaillée, caractéristiques, produits similaires (3 à 4 ProductCards).
4. Panier (CartDrawer): panneau latéral qui glisse depuis la droite par-dessus la page.
   - Liste des articles: miniature, nom, origine, poids, quantité modifiable, prix, bouton supprimer.
   - Sous-total, bouton "Commander", lien "Continuer mes achats". État "panier vide" en variante.
5. Connexion / Inscription (AuthModal): fenêtre modale avec deux onglets "Connexion" et "Inscription".
   - Connexion: email, mot de passe, bouton, lien "Mot de passe oublié".
   - Inscription: nom, prénom, email, mot de passe, confirmation, bouton.
6. Espace client (/compte): menu latéral avec 4 sections: Mes informations, Mes adresses, Mes achats (liste de commandes avec date, statut, total), Sécurité (changer le mot de passe).
7. Qui sommes-nous (/qui-sommes-nous): titre, texte d'histoire, valeurs en 3 blocs, image.
8. Admin (/admin): tableau de produits (id, nom, catégorie, prix, stock) avec boutons Modifier / Supprimer, bouton "Ajouter un produit" et un formulaire d'ajout.

PROTOTYPE INTERACTIF (liens entre frames)

- Logo → Accueil.
- Chaque catégorie de la NavBar → page catégorie correspondante.
- Clic sur une ProductCard → Fiche produit.
- "Ajouter au panier" → ouvre le CartDrawer (overlay, animation "move in" depuis la droite).
- Icône panier → ouvre le CartDrawer. Croix du CartDrawer → ferme.
- Icône compte → ouvre l'AuthModal. Après connexion → Espace client.
- "Qui sommes-nous" (menu et section Accueil) → page correspondante.
- Sur mobile: icône burger → menu déroulant.

Organise le tout en deux sections nommées "Desktop" et "Mobile", avec les frames bien nommées (ex. "01 - Accueil", "02 - Catégorie").
