# 🧪 Guide de Test - API Mobile

Ce guide vous permet de tester tous les endpoints de l'API mobile.

---

## 🚀 Démarrage

### 1. Démarrer le backend

```bash
cd backend
php artisan serve
```

Le serveur sera accessible sur `http://localhost:8000`

### 2. Vérifier la base de données

```bash
cd backend
php artisan migrate:fresh --seed
```

---

## 📋 Tests avec cURL

### 1. Inscription d'un nouvel intérimaire

```bash
curl -X POST http://localhost:8000/api/mobile/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom_complet": "Test Mobile",
    "email": "mobile@test.com",
    "password": "password123",
    "password_confirmation": "password123",
    "telephone": "+33612345678",
    "date_naissance": "1990-05-15",
    "adresse": "123 Rue Test, Paris",
    "competences": ["Électricité", "Plomberie"],
    "experience_annees": 3
  }'
```

**Réponse attendue** : Vous devriez recevoir un token et les informations de l'utilisateur créé.

**Copiez le token** pour les prochaines requêtes !

---

### 2. Connexion

```bash
curl -X POST http://localhost:8000/api/mobile/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "password"
  }'
```

**Note** : Utilisez un compte existant de la base de données seedée.

---

### 3. Dashboard

Remplacez `YOUR_TOKEN` par le token obtenu lors de la connexion :

```bash
curl -X GET http://localhost:8000/api/mobile/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. Mon profil

```bash
curl -X GET http://localhost:8000/api/mobile/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. Mettre à jour mon profil

```bash
curl -X PUT http://localhost:8000/api/mobile/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telephone": "+33698765432",
    "adresse": "456 Nouvelle Adresse",
    "competences": ["Électricité", "Plomberie", "Climatisation"],
    "taux_horaire_souhaite": 18.50
  }'
```

---

### 6. Missions disponibles

```bash
curl -X GET http://localhost:8000/api/mobile/missions/disponibles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Avec filtres** :
```bash
curl -X GET "http://localhost:8000/api/mobile/missions/disponibles?lieu=Paris&per_page=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. Détails d'une mission

Remplacez `{id}` par l'ID d'une mission disponible :

```bash
curl -X GET http://localhost:8000/api/mobile/missions/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. Postuler à une mission

```bash
curl -X POST http://localhost:8000/api/mobile/missions/1/postuler \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. Mes missions

```bash
curl -X GET http://localhost:8000/api/mobile/mes-missions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Filtrer par statut** :
```bash
curl -X GET "http://localhost:8000/api/mobile/mes-missions?statut=en_cours" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 10. Mes contrats

```bash
curl -X GET http://localhost:8000/api/mobile/contrats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 11. Détails d'un contrat

```bash
curl -X GET http://localhost:8000/api/mobile/contrats/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 12. Signer un contrat

```bash
curl -X POST http://localhost:8000/api/mobile/contrats/1/signer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "signature": "Jean Dupont"
  }'
```

---

### 13. Mes paiements

```bash
curl -X GET http://localhost:8000/api/mobile/paiements \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 14. Mes documents

```bash
curl -X GET http://localhost:8000/api/mobile/documents \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 15. Upload un document

```bash
curl -X POST http://localhost:8000/api/mobile/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "type=cv" \
  -F "nom=Mon CV 2025" \
  -F "fichier=@/path/to/your/file.pdf"
```

**Note** : Remplacez `/path/to/your/file.pdf` par le chemin réel d'un fichier.

---

### 16. Déconnexion

```bash
curl -X POST http://localhost:8000/api/mobile/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📦 Tests avec Postman

### Configuration de Postman

1. **Créer une collection** : "Omnivyn Mobile API"

2. **Variables de collection** :
   - `base_url` : `http://localhost:8000/api/mobile`
   - `token` : (sera défini après login)

3. **Authentification** :
   - Type : Bearer Token
   - Token : `{{token}}`

### Import rapide

Créer un fichier `postman_collection.json` :

```json
{
  "info": {
    "name": "Omnivyn Mobile API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api/mobile"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

### Scripts automatiques

**Test de connexion avec sauvegarde du token** :

Dans l'onglet "Tests" de la requête Login :
```javascript
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.collectionVariables.set("token", jsonData.token);
});
```

---

## 🧪 Tests avec un client JavaScript

Créer un fichier `test-api.js` :

```javascript
const API_URL = 'http://localhost:8000/api/mobile';
let authToken = '';

// Fonction utilitaire pour les requêtes
async function request(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  return await response.json();
}

// Test 1: Inscription
async function testRegister() {
  console.log('📝 Test: Inscription...');
  const data = await request('/register', 'POST', {
    nom_complet: 'Test JS User',
    email: 'testjs@example.com',
    password: 'password123',
    password_confirmation: 'password123',
    telephone: '+33612345678',
    date_naissance: '1990-01-01',
    adresse: '123 Test Street',
  });
  console.log('✅ Inscription:', data);
  authToken = data.token;
}

// Test 2: Connexion
async function testLogin() {
  console.log('🔑 Test: Connexion...');
  const data = await request('/login', 'POST', {
    email: 'jean.dupont@example.com',
    password: 'password',
  });
  console.log('✅ Connexion:', data);
  authToken = data.token;
}

// Test 3: Dashboard
async function testDashboard() {
  console.log('📊 Test: Dashboard...');
  const data = await request('/dashboard');
  console.log('✅ Dashboard:', data);
}

// Test 4: Missions disponibles
async function testMissionsDisponibles() {
  console.log('🎯 Test: Missions disponibles...');
  const data = await request('/missions/disponibles');
  console.log('✅ Missions:', data);
}

// Lancer tous les tests
async function runTests() {
  try {
    await testLogin();
    await testDashboard();
    await testMissionsDisponibles();
    console.log('✅ Tous les tests sont passés !');
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

runTests();
```

Exécuter avec Node.js :
```bash
node test-api.js
```

---

## ✅ Checklist de tests

### Authentification
- [ ] Inscription avec succès
- [ ] Inscription avec email déjà existant (erreur attendue)
- [ ] Connexion avec succès
- [ ] Connexion avec mauvais mot de passe (erreur attendue)
- [ ] Déconnexion

### Profil
- [ ] Récupérer mon profil
- [ ] Mettre à jour mon profil
- [ ] Mettre à jour avec données invalides (erreur attendue)

### Dashboard
- [ ] Récupérer statistiques
- [ ] Vérifier missions récentes
- [ ] Vérifier paiements récents

### Missions
- [ ] Liste des missions disponibles
- [ ] Filtrer par lieu
- [ ] Filtrer par compétence
- [ ] Détails d'une mission
- [ ] Postuler à une mission
- [ ] Mes missions
- [ ] Filtrer mes missions par statut

### Contrats
- [ ] Liste de mes contrats
- [ ] Détails d'un contrat
- [ ] Signer un contrat
- [ ] Erreur si contrat déjà signé

### Paiements
- [ ] Liste de mes paiements
- [ ] Vérifier pagination

### Documents
- [ ] Liste de mes documents
- [ ] Upload d'un document
- [ ] Erreur si fichier trop volumineux

---

## 🐛 Résolution de problèmes

### Erreur 401 Unauthorized
**Cause** : Token invalide ou expiré
**Solution** : Reconnectez-vous pour obtenir un nouveau token

### Erreur 404 Not Found
**Cause** : Route non trouvée
**Solution** : Vérifiez l'URL et la méthode HTTP

### Erreur 422 Validation Error
**Cause** : Données invalides
**Solution** : Vérifiez le format des données envoyées

### Erreur 500 Server Error
**Cause** : Erreur côté serveur
**Solution** : Consultez les logs Laravel : `backend/storage/logs/laravel.log`

### CORS Error
**Cause** : Configuration CORS
**Solution** : Vérifiez `backend/config/cors.php`

---

## 📊 Résultats attendus

### Après inscription/connexion
Vous devez recevoir :
- Un token d'authentification
- Les informations utilisateur
- Les informations intérimaire

### Dashboard
Vous devez voir :
- Statistiques des missions
- Statistiques des paiements
- Missions récentes
- Paiements récents

### Missions disponibles
Vous devez voir :
- Liste paginée des missions
- Détails de l'entreprise
- Compétences requises
- Taux horaire

---

## 🚀 Prochaines étapes

Une fois les tests backend validés, vous pouvez :

1. ✅ Créer l'application mobile React Native
2. ✅ Implémenter l'authentification
3. ✅ Créer les écrans de navigation
4. ✅ Intégrer les endpoints API
5. ✅ Tester sur émulateur/device

---

## 📝 Notes importantes

- **Token** : Doit être inclus dans toutes les requêtes protégées
- **Pagination** : Utilisez `per_page` pour limiter les résultats
- **Filtres** : Disponibles sur plusieurs endpoints
- **Upload** : Utilisez `multipart/form-data` pour les fichiers
- **Statuts** : 
  - Missions : `ouverte`, `en_cours`, `terminee`
  - Paiements : `en_attente`, `valide`, `paye`
  - Disponibilité : `disponible`, `occupe`, `indisponible`

---

**Date** : 18 Octobre 2025  
**Version** : 1.0.0
