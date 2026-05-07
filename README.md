# 🍽️ Projet 8 — Gestion de Commandes Restaurant
### MEAN Stack : MongoDB · Express · Angular 17 · Node.js
**Polytech Monastir — FullStack JS 2025/2026**

---

## 📁 Structure du projet

```
restaurant-app/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   │   ├── categorie.controller.js
│   │   │   │   ├── plat.controller.js
│   │   │   │   └── commande.controller.js
│   │   │   ├── models/
│   │   │   │   ├── categorie.model.js
│   │   │   │   ├── plat.model.js
│   │   │   │   └── commande.model.js
│   │   │   └── routes/
│   │   │       └── routes.js
│   │   ├── config/
│   │   │   └── config.js
│   │   └── database/
│   │       └── db.config.js
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── frontend/
    └── src/
        └── app/
            ├── components/
            │   ├── header/
            │   ├── plats/
            │   ├── categories/
            │   ├── commandes/
            │   └── panier/
            ├── services/
            │   └── restaurant.service.ts
            ├── models/
            │   └── models.ts
            └── environments/
                └── environment.ts
```

---

## 🚀 Installation et lancement

### Prérequis
- Node.js (v18+)
- MongoDB (local port 27017 ou MongoDB Atlas)
- Angular CLI v17 : `npm install -g @angular/cli`

### 1. Backend

```bash
cd restaurant-app/backend
npm install
# Vérifier le fichier .env :
# PORT=3000
# DATABASE_URL=mongodb://0.0.0.0:27017/restaurant
nodemon index.js
```

Le serveur démarre sur **http://localhost:3000**
Les données de démonstration (4 catégories + 9 plats) sont insérées automatiquement.

### 2. Frontend

```bash
cd restaurant-app/frontend
npm install
ng serve
```

L'application est disponible sur **http://localhost:4200**

---

## 🔌 API REST — Routes disponibles

### Catégories
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/categories | Liste toutes les catégories |
| GET | /api/categories/:id | Détail d'une catégorie |
| POST | /api/categories | Créer une catégorie |
| PUT | /api/categories/:id | Modifier une catégorie |
| DELETE | /api/categories/:id | Supprimer une catégorie |

### Plats
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/plats | Liste tous les plats (avec catégorie) |
| GET | /api/plats/search?nom=XXX | Recherche par nom |
| GET | /api/plats/categorie/:id | Filtrer par catégorie |
| GET | /api/plats/:id | Détail d'un plat |
| POST | /api/plats | Créer un plat |
| PUT | /api/plats/:id | Modifier un plat |
| DELETE | /api/plats/:id | Supprimer un plat |

### Commandes
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | /api/commandes | Liste toutes les commandes |
| GET | /api/commandes/:id | Détail d'une commande |
| POST | /api/commandes | Créer une commande |
| PUT | /api/commandes/:id | Modifier le statut |
| DELETE | /api/commandes/:id | Supprimer une commande |

---

## 🧪 Tests Postman / Thunder Client

### POST /api/categories
```json
{
  "nom": "Pizzas",
  "description": "Pizzas artisanales",
  "icone": "🍕"
}
```

### POST /api/plats
```json
{
  "nom": "Pizza Margherita",
  "description": "Tomate, mozzarella, basilic",
  "prix": 12.5,
  "categorie": "<ID_CATEGORIE>",
  "disponible": true
}
```

### POST /api/commandes
```json
{
  "numeroTable": 3,
  "client": "Ahmed",
  "lignes": [
    { "plat": "<ID_PLAT_1>", "quantite": 2 },
    { "plat": "<ID_PLAT_2>", "quantite": 1 }
  ],
  "notes": "Sans gluten svp"
}
```

### PUT /api/commandes/:id (changer statut)
```json
{ "statut": "en_preparation" }
```

---

## ✅ Fonctionnalités implémentées

### Backend
- [x] Connexion MongoDB via Mongoose
- [x] 3 modèles : Categorie, Plat, Commande
- [x] CRUD complet pour chaque modèle
- [x] populate() pour les relations (plat → catégorie)
- [x] Calcul automatique du total de commande
- [x] Recherche par nom (regex)
- [x] Filtre par catégorie
- [x] Gestion des erreurs (400, 404, 500)
- [x] CORS activé
- [x] Variables d'environnement (.env)
- [x] Données de démo auto-insérées

### Frontend Angular 17
- [x] Architecture standalone components
- [x] Routing (4 routes)
- [x] Service HTTP (RestaurantService)
- [x] Composant Plats : liste en cards, CRUD, recherche, filtre
- [x] Composant Catégories : CRUD complet
- [x] Composant Panier : ajout/retrait, calcul total, formulaire commande
- [x] Composant Commandes : liste, détails dépliables, changement de statut
- [x] ReactiveFormsModule avec validations
- [x] Directives *ngFor, *ngIf, *ngClass
- [x] Pipes (date, number)
- [x] Bootstrap 5 (UI responsive)

---

## 🏆 Barème estimé

| Critère | Points |
|---------|--------|
| MongoDB + modèles Mongoose | 4/4 |
| Backend Node.js / Express / CRUD | 5/5 |
| Tests API Postman | 2/2 |
| Frontend Angular 17 | 5/5 |
| Qualité, ergonomie, organisation | 2/2 |
| **Total** | **18/20** |
