# 🏢 Omnivyn Intérim - Application de Gestion d'Intérim

Application complète de gestion d'intérim avec backend Laravel et frontend React.

---

## 🚀 Démarrage Rapide

```bash
# 1. Installer axios pour le frontend
npm install axios

# 2. Démarrer le backend
cd backend
php artisan migrate:fresh --seed
php artisan serve

# 3. Dans un autre terminal, démarrer le frontend
npm run dev
```

**Accès** :
- Frontend : http://localhost:5173
- Backend API : http://localhost:8000/api

**Compte admin** : `admin@omnivyn.fr` / `password`

---

## 📋 Fonctionnalités

### ✨ Gestion complète
- 👥 **Entreprises** - Gestion des clients
- 💼 **Intérimaires** - Gestion des travailleurs
- 🎯 **Missions** - Création et suivi des missions
- 💰 **Paiements** - Validation et suivi des paiements
- 📄 **Documents** - Upload et gestion des documents
- 📝 **Contrats** - Génération et signature électronique

### 🔐 Sécurité
- Authentification JWT avec Laravel Sanctum
- Rôles et permissions (admin, entreprise, interimaire)
- Validation des données
- Protection CSRF

### 📊 Dashboard
- Statistiques en temps réel
- Graphiques d'activité
- Missions récentes
- Intérimaires disponibles

---

## 🛠️ Technologies

### Backend
- **Laravel 12** - Framework PHP
- **SQLite** - Base de données (MySQL/PostgreSQL en production)
- **Laravel Sanctum** - Authentification API
- **PHP 8.2+**

### Frontend
- **React 18** - Framework JavaScript
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Tailwind CSS** - Styling
- **Radix UI** - Composants UI
- **Recharts** - Graphiques

---

## 📁 Structure du Projet

```
Omnivyn Intérim/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   └── Http/Requests/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
│
├── src/                  # React Frontend
│   ├── api/
│   │   ├── laravelClient.js
│   │   └── laravelEntities.js
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── main.jsx
│
└── Documentation/
    ├── DEMARRAGE_RAPIDE.md
    ├── FRONTEND_CONNECTION_GUIDE.md
    ├── RECAP_FINAL.md
    └── backend/
        ├── API_README.md
        └── MIGRATION_GUIDE.md
```

---

## 📖 Documentation

### 🚀 Pour commencer
- **[DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)** - Guide d'installation en 5 minutes

### 🔌 Frontend
- **[FRONTEND_CONNECTION_GUIDE.md](FRONTEND_CONNECTION_GUIDE.md)** - Connexion frontend/backend
- Utilisation des contextes React
- Gestion de l'authentification

### ⚙️ Backend
- **[backend/API_README.md](backend/API_README.md)** - Documentation complète de l'API
- Tous les endpoints avec exemples
- Format des requêtes et réponses

### 📊 Vue d'ensemble
- **[RECAP_FINAL.md](RECAP_FINAL.md)** - Architecture complète du projet
- Liste de tous les fichiers créés
- Tests et vérifications

---

## 🔐 Comptes de Test

### Admin
```
Email    : admin@omnivyn.fr
Password : password
Rôle     : Administrateur complet
```

### Entreprises
```
contact@techsolutions.fr / password (Technologie)
contact@batipro.fr       / password (Construction)
contact@legourmet.fr     / password (Restauration)
```

### Intérimaires
```
jean.dupont@example.fr   / password
marie.martin@example.fr  / password
pierre.dubois@example.fr / password
```

---

## 📊 Données de Test

La base de données est pré-remplie avec :
- **17 utilisateurs** (1 admin, 3 entreprises, 3 intérimaires, 10 autres)
- **23 entreprises** (18 actives, 5 inactives)
- **48 intérimaires** (30 disponibles, 10 en mission, 5 indisponibles)
- **50+ missions** (ouvertes, en cours, terminées)
- **30+ paiements** avec différents statuts
- **40+ documents** (CV, KBIS, contrats)
- **20+ contrats** signés

---

## 🧪 Tests

### Backend
```bash
cd backend
php artisan test
```

### Frontend
```bash
npm run test
```

### Test de l'API
```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@omnivyn.fr","password":"password"}'

# Liste des missions (avec token)
curl http://localhost:8000/api/missions \
  -H "Authorization: Bearer {token}"
```

---

## 🚀 Déploiement

### Backend Laravel

1. **Base de données** : Configurez MySQL ou PostgreSQL
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=omnivyn
DB_USERNAME=root
DB_PASSWORD=
```

2. **Optimisations**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

3. **Sécurité**
```env
APP_ENV=production
APP_DEBUG=false
```

### Frontend React

```bash
# Build pour production
npm run build

# Les fichiers sont dans dist/
# Déployez sur Vercel, Netlify, ou votre serveur
```

---

## 🔧 Configuration

### Variables d'environnement

**Frontend** (`.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

**Backend** (`backend/.env`)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
```

---

## 🛠️ Commandes Utiles

### Backend
```bash
# Réinitialiser la base de données
php artisan migrate:fresh --seed

# Voir toutes les routes
php artisan route:list

# Nettoyer le cache
php artisan cache:clear

# Créer un controller
php artisan make:controller Api/MonController

# Créer une migration
php artisan make:migration create_ma_table
```

### Frontend
```bash
# Installer les dépendances
npm install

# Démarrer en développement
npm run dev

# Build pour production
npm run build

# Linter
npm run lint
```

---

## 🐛 Troubleshooting

### CORS Error
Vérifiez `backend/config/cors.php` et assurez-vous que le backend tourne.

### 401 Unauthorized
Votre token a expiré. Reconnectez-vous.

### Database Error
Réinitialisez la base : `php artisan migrate:fresh --seed`

### Module Not Found
Redémarrez les serveurs après modification des fichiers de configuration.

---

## 📚 Ressources

- [Documentation Laravel](https://laravel.com/docs)
- [Documentation React](https://react.dev)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🤝 Contribution

Ce projet est une migration de Base44 vers une architecture indépendante Laravel + React.

---

## 📄 Licence

MIT License

---

## 👥 Support

Pour toute question ou problème :
1. Consultez la documentation dans le dossier du projet
2. Vérifiez les logs (console navigateur + `backend/storage/logs/laravel.log`)
3. Testez les endpoints API avec Postman ou curl

---

## ✨ Fonctionnalités à venir

- [ ] Notifications en temps réel (websockets)
- [ ] Export PDF des documents
- [ ] Statistiques avancées
- [ ] Application mobile
- [ ] Système de messagerie interne
- [ ] Notifications par email

---

## 🎉 Remerciements

Merci d'utiliser Omnivyn Intérim !

**L'application est maintenant 100% indépendante et prête pour la production.** 🚀

---

*Développé avec ❤️ pour la gestion d'intérim moderne*
