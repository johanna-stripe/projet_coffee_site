# Profils et authentification

Résumé de la différence entre visiteur, invité, cliente et admin, et du rôle de `users`, `customer` et `authenticate`.

## Les 4 profils

| Profil | Compte (`users`) | Fiche (`customer`) | Token de connexion | Ce qu'il peut faire aujourd'hui |
|---|---|---|---|---|
| **Visiteur** | non | non | non | voir les produits, s'inscrire, se connecter |
| **Invité** (customer sans compte) | non | oui (`user_id = NULL`) | non | rien de plus qu'un visiteur (aucune route ne le reconnaît) |
| **Cliente** (customer avec compte) | oui | oui (`user_id` rempli) | oui | panier, commandes, profil, adresses |
| **Admin** (`users` avec rôle `ADMIN`) | oui | pas forcément | oui | gérer produits, marques, utilisateurs |

## Les deux tables

- **`users`** = la clé : qui peut se connecter (email, mot de passe, rôle, `is_active`).
- **`customer`** = la fiche client : qui achète et où livrer (nom, téléphone, date de naissance, adresses).
- Le lien est `customer.user_id` → `users.user_id`. Il peut être NULL (client invité).
- `cart` et `order` pointent vers `customer`, pas vers `users`.

## Le parcours d'une cliente

```
VISITEUR
   │  s'inscrit (POST /auth/register)
   ▼
┌──────────────┐   user_id    ┌──────────────┐
│    users     │◄─────────────│   customer   │
│ email, mdp,  │              │ nom, tél,    │
│ rôle         │              │ adresses     │
└──────────────┘              └──────┬───────┘
   │  se connecte (POST /auth/login)        │ customer_id
   ▼                                        ▼
cookie « token »                   ┌─────────────────┐
   │                               │ cart → cart_item │
   │  chaque requête               │ order            │
   ▼                               └─────────────────┘
authenticate  ──►  req.user.customer_id
   │
   ▼
checkCustomerOwner : req.user.customer_id === :customer_id ?
   ├── oui → la route s'exécute
   └── non → 403 Access denied
```

## Les deux middlewares du panier

| Middleware | Question posée | Réponse si non |
|---|---|---|
| `authenticate` | Qui fait la requête ? (cookie `token` valide, compte actif) | 401 |
| `checkCustomerOwner` | Ce panier est-il bien le sien ? | 403 |

Sans `authenticate`, n'importe qui pourrait appeler `/cart/2` et toucher au panier d'une autre cliente.

## Point ouvert : l'invité

La base prévoit les invités (`user_id` nullable), mais aucune route ne les gère : le panier et les commandes sont derrière `authenticate`.

Pour permettre à un invité de commander sans compte, il faudrait :
- une route de commande sans `authenticate` ;
- un panier gardé dans le navigateur (`localStorage`) avant la commande.

Décision actuelle : compte obligatoire pour le panier, pour deux raisons :
1. **Sécurité** : `authenticate` + `checkCustomerOwner` garantissent qu'une cliente ne touche qu'à son propre panier. Un invité demanderait une route sans authentification et un autre moyen de la protéger.
2. **Stockage** : le panier vit en base (`cart` → `customer`), il est donc rattaché à une personne identifiée.

L'invité reste une amélioration possible, `user_id` reste donc nullable.
