# 📱 API Mobile - Documentation Intérimaires

Documentation complète de l'API mobile pour l'application intérimaire Omnivyn.

**Base URL** : `http://localhost:8000/api/mobile`

---

## 🔐 Authentification

### 1. Inscription

**Endpoint** : `POST /mobile/register`

**Body** :
```json
{
  "nom_complet": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "telephone": "+33612345678",
  "date_naissance": "1990-05-15",
  "adresse": "123 Rue de la Paix, 75001 Paris",
  "competences": ["Électricité", "Plomberie"],
  "experience_annees": 5
}
```

**Réponse** :
```json
{
  "message": "Inscription réussie",
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "role": "interimaire"
  },
  "interimaire": {
    "id": 1,
    "user_id": 1,
    "nom_complet": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "telephone": "+33612345678",
    "statut": "disponible",
    "disponibilite": "disponible"
  },
  "token": "1|abc123def456..."
}
```

---

### 2. Connexion

**Endpoint** : `POST /mobile/login`

**Body** :
```json
{
  "email": "jean.dupont@example.com",
  "password": "password123"
}
```

**Réponse** :
```json
{
  "message": "Connexion réussie",
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "role": "interimaire"
  },
  "interimaire": {
    "id": 1,
    "nom_complet": "Jean Dupont",
    "statut": "disponible"
  },
  "token": "2|xyz789ghi012..."
}
```

---

### 3. Déconnexion

**Endpoint** : `POST /mobile/logout`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** :
```json
{
  "message": "Déconnexion réussie"
}
```

---

## 👤 Profil

### 1. Récupérer mon profil

**Endpoint** : `GET /mobile/profile`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** :
```json
{
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "role": "interimaire"
  },
  "interimaire": {
    "id": 1,
    "nom_complet": "Jean Dupont",
    "email": "jean.dupont@example.com",
    "telephone": "+33612345678",
    "adresse": "123 Rue de la Paix, 75001 Paris",
    "date_naissance": "1990-05-15",
    "competences": ["Électricité", "Plomberie"],
    "experience_annees": 5,
    "disponibilite": "disponible",
    "statut": "disponible",
    "taux_horaire_souhaite": "15.50",
    "photo_url": null,
    "cv_url": null,
    "note": null,
    "documents": [],
    "missions": []
  }
}
```

---

### 2. Mettre à jour mon profil

**Endpoint** : `PUT /mobile/profile`

**Headers** :
```
Authorization: Bearer {token}
```

**Body** :
```json
{
  "nom_complet": "Jean Dupont",
  "telephone": "+33612345678",
  "adresse": "456 Avenue des Champs",
  "competences": ["Électricité", "Plomberie", "Climatisation"],
  "experience_annees": 6,
  "taux_horaire_souhaite": 18.00,
  "disponibilite": "disponible"
}
```

**Réponse** :
```json
{
  "message": "Profil mis à jour avec succès",
  "interimaire": {
    "id": 1,
    "nom_complet": "Jean Dupont",
    "telephone": "+33612345678",
    "adresse": "456 Avenue des Champs",
    "competences": ["Électricité", "Plomberie", "Climatisation"],
    "experience_annees": 6,
    "taux_horaire_souhaite": "18.00",
    "disponibilite": "disponible"
  }
}
```

---

## 📊 Dashboard

**Endpoint** : `GET /mobile/dashboard`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** :
```json
{
  "stats": {
    "missions_total": 12,
    "missions_en_cours": 1,
    "missions_terminees": 10,
    "paiements_total": "8450.00",
    "paiements_en_attente": 2,
    "documents_total": 5,
    "taux_horaire_moyen": "16.50"
  },
  "missions_recentes": [
    {
      "id": 45,
      "titre": "Électricien chantier",
      "entreprise": {
        "nom": "BatiPro"
      },
      "date_debut": "2025-10-20",
      "date_fin": "2025-11-20",
      "statut": "en_cours",
      "taux_horaire": "18.00"
    }
  ],
  "paiements_recents": [
    {
      "id": 23,
      "montant": "850.00",
      "statut": "paye",
      "mission": {
        "titre": "Plombier urgent"
      },
      "created_at": "2025-10-10"
    }
  ],
  "interimaire": {
    "id": 1,
    "nom_complet": "Jean Dupont",
    "statut": "en_mission"
  }
}
```

---

## 🎯 Missions

### 1. Missions disponibles

**Endpoint** : `GET /mobile/missions/disponibles`

**Headers** :
```
Authorization: Bearer {token}
```

**Query Params** :
- `per_page` (optional) : Nombre de résultats par page (défaut: 15)
- `competence` (optional) : Filtrer par compétence
- `lieu` (optional) : Filtrer par lieu
- `taux_min` (optional) : Taux horaire minimum

**Exemple** : `/mobile/missions/disponibles?competence=Électricité&lieu=Paris&per_page=10`

**Réponse** :
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 45,
      "titre": "Électricien chantier neuf",
      "description": "Installation électrique complète d'un immeuble",
      "date_debut": "2025-10-25",
      "date_fin": "2025-12-20",
      "taux_horaire": "18.50",
      "statut": "ouverte",
      "competences_requises": ["Électricité", "Habilitation électrique"],
      "lieu": "Paris 15ème",
      "type_contrat": "CDD",
      "entreprise": {
        "id": 5,
        "nom": "BatiPro",
        "email": "contact@batipro.fr",
        "secteur": "Construction"
      }
    }
  ],
  "total": 25,
  "per_page": 15
}
```

---

### 2. Détails d'une mission

**Endpoint** : `GET /mobile/missions/{id}`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** :
```json
{
  "id": 45,
  "titre": "Électricien chantier neuf",
  "description": "Installation électrique complète d'un immeuble de 50 logements. Lecture de plans, tirage de câbles, pose de tableaux électriques...",
  "date_debut": "2025-10-25",
  "date_fin": "2025-12-20",
  "taux_horaire": "18.50",
  "statut": "ouverte",
  "competences_requises": ["Électricité", "Habilitation électrique", "Lecture de plans"],
  "lieu": "Paris 15ème",
  "type_contrat": "CDD",
  "interimaire_id": null,
  "entreprise": {
    "id": 5,
    "nom": "BatiPro",
    "email": "contact@batipro.fr",
    "telephone": "+33123456789",
    "secteur": "Construction",
    "ville": "Paris"
  },
  "created_at": "2025-10-15T10:30:00.000000Z"
}
```

---

### 3. Postuler à une mission

**Endpoint** : `POST /mobile/missions/{id}/postuler`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse (Succès)** :
```json
{
  "message": "Candidature envoyée avec succès",
  "mission": {
    "id": 45,
    "titre": "Électricien chantier neuf",
    "statut": "en_cours",
    "interimaire_id": 1,
    "entreprise": {
      "nom": "BatiPro"
    }
  }
}
```

**Erreurs possibles** :
```json
// Mission déjà assignée
{
  "message": "Cette mission est déjà assignée"
}

// Mission non disponible
{
  "message": "Cette mission n'est plus disponible"
}

// Intérimaire non disponible
{
  "message": "Vous devez être disponible pour postuler"
}
```

---

### 4. Mes missions

**Endpoint** : `GET /mobile/mes-missions`

**Headers** :
```
Authorization: Bearer {token}
```

**Query Params** :
- `per_page` (optional) : Nombre de résultats par page (défaut: 15)
- `statut` (optional) : Filtrer par statut (ouverte, en_cours, terminee)

**Exemple** : `/mobile/mes-missions?statut=en_cours`

**Réponse** :
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 45,
      "titre": "Électricien chantier neuf",
      "description": "Installation électrique...",
      "date_debut": "2025-10-25",
      "date_fin": "2025-12-20",
      "taux_horaire": "18.50",
      "statut": "en_cours",
      "lieu": "Paris 15ème",
      "entreprise": {
        "id": 5,
        "nom": "BatiPro",
        "email": "contact@batipro.fr"
      }
    },
    {
      "id": 32,
      "titre": "Plombier urgent",
      "statut": "terminee",
      "date_debut": "2025-09-01",
      "date_fin": "2025-09-30",
      "taux_horaire": "16.00",
      "entreprise": {
        "nom": "Plomberie Services"
      }
    }
  ],
  "total": 12,
  "per_page": 15
}
```

---

## 📄 Contrats

### 1. Mes contrats

**Endpoint** : `GET /mobile/contrats`

**Headers** :
```
Authorization: Bearer {token}
```

**Query Params** :
- `per_page` (optional) : Nombre de résultats par page (défaut: 15)

**Réponse** :
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 12,
      "type": "CDD",
      "date_debut": "2025-10-25",
      "date_fin": "2025-12-20",
      "taux_horaire": "18.50",
      "conditions": "Horaires: 8h-17h, Pause déjeuner: 1h...",
      "statut": "actif",
      "signature_entreprise": "data:image/png;base64...",
      "signature_interimaire": null,
      "date_signature_entreprise": "2025-10-20T14:30:00Z",
      "date_signature_interimaire": null,
      "mission": {
        "id": 45,
        "titre": "Électricien chantier neuf"
      },
      "entreprise": {
        "id": 5,
        "nom": "BatiPro"
      }
    }
  ],
  "total": 8,
  "per_page": 15
}
```

---

### 2. Détails d'un contrat

**Endpoint** : `GET /mobile/contrats/{id}`

**Headers** :
```
Authorization: Bearer {token}
```

**Réponse** :
```json
{
  "id": 12,
  "type": "CDD",
  "date_debut": "2025-10-25",
  "date_fin": "2025-12-20",
  "taux_horaire": "18.50",
  "conditions": "Horaires: 8h-17h du lundi au vendredi\nPause déjeuner: 1h\nÉquipements fournis: Outils de base\nLieu: Paris 15ème...",
  "statut": "actif",
  "signature_entreprise": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "signature_interimaire": null,
  "date_signature_entreprise": "2025-10-20T14:30:00.000000Z",
  "date_signature_interimaire": null,
  "mission": {
    "id": 45,
    "titre": "Électricien chantier neuf",
    "description": "Installation électrique complète..."
  },
  "entreprise": {
    "id": 5,
    "nom": "BatiPro",
    "email": "contact@batipro.fr",
    "telephone": "+33123456789"
  },
  "created_at": "2025-10-20T14:30:00.000000Z"
}
```

---

### 3. Signer un contrat

**Endpoint** : `POST /mobile/contrats/{id}/signer`

**Headers** :
```
Authorization: Bearer {token}
```

**Body** :
```json
{
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

**Réponse** :
```json
{
  "message": "Contrat signé avec succès",
  "contrat": {
    "id": 12,
    "type": "CDD",
    "statut": "actif",
    "signature_interimaire": "data:image/png;base64...",
    "date_signature_interimaire": "2025-10-18T16:45:00.000000Z"
  }
}
```

**Erreur** :
```json
{
  "message": "Ce contrat est déjà signé"
}
```

---

## 💰 Paiements

**Endpoint** : `GET /mobile/paiements`

**Headers** :
```
Authorization: Bearer {token}
```

**Query Params** :
- `per_page` (optional) : Nombre de résultats par page (défaut: 15)

**Réponse** :
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 23,
      "montant": "850.00",
      "statut": "paye",
      "type": "salaire",
      "date_paiement": "2025-10-05",
      "notes": "Paiement mission septembre",
      "mission": {
        "id": 32,
        "titre": "Plombier urgent"
      },
      "entreprise": {
        "id": 3,
        "nom": "Plomberie Services"
      },
      "created_at": "2025-10-01T00:00:00.000000Z"
    },
    {
      "id": 18,
      "montant": "1200.50",
      "statut": "en_attente",
      "type": "salaire",
      "date_paiement": null,
      "notes": "Paiement mission août",
      "mission": {
        "id": 28,
        "titre": "Électricien maintenance"
      },
      "entreprise": {
        "nom": "TechSolutions"
      },
      "created_at": "2025-09-01T00:00:00.000000Z"
    }
  ],
  "total": 15,
  "per_page": 15
}
```

---

## 📁 Documents

### 1. Mes documents

**Endpoint** : `GET /mobile/documents`

**Headers** :
```
Authorization: Bearer {token}
```

**Query Params** :
- `per_page` (optional) : Nombre de résultats par page (défaut: 15)

**Réponse** :
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 5,
      "type": "cv",
      "nom": "CV Jean Dupont 2025",
      "chemin": "documents/interimaires/1698765432_cv.pdf",
      "url": "http://localhost:8000/storage/documents/interimaires/1698765432_cv.pdf",
      "created_at": "2025-10-15T10:20:00.000000Z"
    },
    {
      "id": 6,
      "type": "certification",
      "nom": "Habilitation électrique",
      "chemin": "documents/interimaires/1698765433_cert.pdf",
      "url": "http://localhost:8000/storage/documents/interimaires/1698765433_cert.pdf",
      "created_at": "2025-10-15T10:25:00.000000Z"
    }
  ],
  "total": 5,
  "per_page": 15
}
```

---

### 2. Upload un document

**Endpoint** : `POST /mobile/documents/upload`

**Headers** :
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (FormData)** :
```
type: cv (cv|piece_identite|diplome|certification|autre)
nom: CV Jean Dupont 2025
fichier: [FILE] (max 10MB)
```

**Réponse** :
```json
{
  "message": "Document uploadé avec succès",
  "document": {
    "id": 7,
    "type": "cv",
    "nom": "CV Jean Dupont 2025",
    "chemin": "documents/interimaires/1729261234_cv.pdf",
    "url": "http://localhost:8000/storage/documents/interimaires/1729261234_cv.pdf",
    "created_at": "2025-10-18T16:53:54.000000Z"
  }
}
```

---

## 🔒 Authentification des requêtes

Toutes les routes protégées nécessitent un header `Authorization` :

```
Authorization: Bearer {token}
```

Le token est obtenu lors de la connexion ou de l'inscription.

---

## ⚠️ Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Mauvaise requête |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Ressource non trouvée |
| 422 | Erreur de validation |
| 500 | Erreur serveur |

---

## 📝 Exemple d'utilisation (JavaScript)

```javascript
// Configuration axios
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/mobile',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Connexion
const login = async (email, password) => {
  const response = await apiClient.post('/login', { email, password });
  localStorage.setItem('auth_token', response.data.token);
  return response.data;
};

// Récupérer les missions disponibles
const getMissionsDisponibles = async () => {
  const response = await apiClient.get('/missions/disponibles');
  return response.data;
};

// Postuler à une mission
const postulerMission = async (missionId) => {
  const response = await apiClient.post(`/missions/${missionId}/postuler`);
  return response.data;
};
```

---

## 🚀 Tester l'API

### Avec cURL

```bash
# Inscription
curl -X POST http://localhost:8000/api/mobile/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom_complet": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "telephone": "+33612345678",
    "date_naissance": "1990-01-01",
    "adresse": "123 Test Street"
  }'

# Connexion
curl -X POST http://localhost:8000/api/mobile/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Dashboard (avec token)
curl -X GET http://localhost:8000/api/mobile/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Avec Postman

1. Créer une nouvelle collection "Omnivyn Mobile API"
2. Ajouter les endpoints ci-dessus
3. Configurer l'authentification Bearer Token
4. Tester chaque endpoint

---

## 📦 Résumé des endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /mobile/register | Inscription |
| POST | /mobile/login | Connexion |
| POST | /mobile/logout | Déconnexion |
| GET | /mobile/profile | Mon profil |
| PUT | /mobile/profile | Mettre à jour profil |
| GET | /mobile/dashboard | Dashboard |
| GET | /mobile/missions/disponibles | Missions disponibles |
| GET | /mobile/missions/{id} | Détails mission |
| POST | /mobile/missions/{id}/postuler | Postuler |
| GET | /mobile/mes-missions | Mes missions |
| GET | /mobile/contrats | Mes contrats |
| GET | /mobile/contrats/{id} | Détails contrat |
| POST | /mobile/contrats/{id}/signer | Signer contrat |
| GET | /mobile/paiements | Mes paiements |
| GET | /mobile/documents | Mes documents |
| POST | /mobile/documents/upload | Upload document |

---

**Date de dernière mise à jour** : 18 Octobre 2025

**Version API** : 1.0.0
