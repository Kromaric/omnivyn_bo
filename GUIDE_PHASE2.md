# 🚀 Guide de Démarrage - Phase 2 : Application Mobile

Ce guide vous accompagne pas à pas pour créer l'application mobile React Native pour les intérimaires.

---

## ✅ Pré-requis

Avant de commencer, assurez-vous que :
- ✅ La Phase 1 est terminée (Backend API Mobile)
- ✅ Le backend Laravel fonctionne (`php artisan serve`)
- ✅ Vous avez testé l'API mobile avec les scripts fournis
- ✅ Node.js et npm sont installés

---

## 📱 Option 1 : React Native avec Expo (Recommandé)

### Pourquoi Expo ?
- ✅ Configuration simplifiée
- ✅ Développement plus rapide
- ✅ Hot reload
- ✅ Prévisualisation sur téléphone via Expo Go
- ✅ Build dans le cloud (Expo EAS)

### 1. Installation

```bash
# Installer Expo CLI globalement
npm install -g expo-cli

# Créer le projet
cd "C:\Users\romar\OneDrive\Bureau"
npx create-expo-app omnivyn-mobile

# Entrer dans le projet
cd omnivyn-mobile
```

### 2. Installer les dépendances essentielles

```bash
# Navigation
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# HTTP et stockage
npm install axios
npx expo install @react-native-async-storage/async-storage

# UI Components
npm install react-native-paper
npm install react-native-vector-icons

# Formulaires
npm install react-hook-form

# Utilitaires
npm install date-fns

# Gestion de fichiers
npx expo install expo-document-picker expo-image-picker
```

### 3. Structure du projet

```bash
# Créer la structure
mkdir -p src/api src/screens src/navigation src/contexts src/components src/utils

# Créer les fichiers de base
touch src/api/client.js
touch src/api/auth.js
touch src/api/missions.js
touch src/contexts/AuthContext.js
touch src/navigation/AppNavigator.js
```

### 4. Configuration de l'API

**Créer `src/api/client.js`** :

```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Remplacez par votre IP locale si vous testez sur device
const API_URL = 'http://10.0.2.2:8000/api/mobile'; // Android Emulator
// const API_URL = 'http://localhost:8000/api/mobile'; // iOS Simulator
// const API_URL = 'http://YOUR_IP:8000/api/mobile'; // Device physique

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur pour ajouter le token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
      // Rediriger vers login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**Créer `src/api/auth.js`** :

```javascript
import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
  const response = await apiClient.post('/login', { email, password });
  await AsyncStorage.setItem('auth_token', response.data.token);
  await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

export const register = async (data) => {
  const response = await apiClient.post('/register', data);
  await AsyncStorage.setItem('auth_token', response.data.token);
  await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

export const logout = async () => {
  await apiClient.post('/logout');
  await AsyncStorage.removeItem('auth_token');
  await AsyncStorage.removeItem('user');
};

export const getProfile = async () => {
  const response = await apiClient.get('/profile');
  return response.data;
};
```

### 5. Context d'authentification

**Créer `src/contexts/AuthContext.js`** :

```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const register = async (data) => {
    const result = await authApi.register(data);
    setUser(result.user);
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 6. Écran de connexion simple

**Créer `src/screens/LoginScreen.js`** :

```javascript
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('jean.dupont@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
      // Navigation gérée automatiquement par le navigator
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.message || 'Connexion échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Omnivyn Intérim
      </Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      >
        Se connecter
      </Button>
      
      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        style={styles.button}
      >
        Créer un compte
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});
```

### 7. Navigation de base

**Créer `src/navigation/AppNavigator.js`** :

```javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
// Import autres écrans...

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      {/* Ajouter autres tabs */}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Ou un écran de chargement
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
```

### 8. App.js principal

**Modifier `App.js`** :

```javascript
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
```

### 9. Lancer l'application

```bash
# Démarrer Expo
npx expo start

# Puis :
# - Appuyez sur 'a' pour Android
# - Appuyez sur 'i' pour iOS
# - Scannez le QR code avec Expo Go sur votre téléphone
```

---

## 📱 Option 2 : React Native CLI (Avancé)

### Installation

```bash
# Créer le projet
npx react-native init OmnivynMobile --version latest
cd OmnivynMobile

# Installer les dépendances (similaires à Expo)
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install axios @react-native-async-storage/async-storage
npm install react-native-paper

# iOS uniquement
cd ios && pod install && cd ..

# Lancer
npm run android  # ou npm run ios
```

---

## 📊 Ordre de Développement Recommandé

### Semaine 1 : Base
1. ✅ Setup projet et dépendances
2. ✅ Configuration API client
3. ✅ AuthContext
4. ✅ Navigation de base
5. ✅ Écrans Login/Register
6. ✅ Test de connexion avec l'API

### Semaine 2 : Fonctionnalités principales
7. ⬜ Dashboard avec statistiques
8. ⬜ Liste des missions disponibles
9. ⬜ Détails mission + Postulation
10. ⬜ Mes missions

### Semaine 3 : Contrats et documents
11. ⬜ Liste des contrats
12. ⬜ Signature de contrat
13. ⬜ Mes paiements
14. ⬜ Mes documents + Upload

### Semaine 4 : Finalisation
15. ⬜ Profil utilisateur
16. ⬜ Polissage UI/UX
17. ⬜ Tests
18. ⬜ Build production

---

## 🎨 Conseils UI/UX

### Design System
- Utilisez React Native Paper pour la cohérence
- Palette de couleurs professionnelle
- Espacements cohérents
- Feedback visuel sur toutes les actions

### Navigation
- Bottom tabs pour les sections principales
- Stack navigator pour les détails
- Bouton retour clair
- Indicateur de chargement

### États
- Loading states
- Empty states
- Error states
- Success feedback

---

## 🧪 Tests

```bash
# Test avec l'API locale
# Assurez-vous que le backend tourne

# Test de connexion
curl -X POST http://YOUR_IP:8000/api/mobile/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jean.dupont@example.com","password":"password"}'
```

---

## 📱 Test sur Device Physique

### Trouver votre IP locale

**Windows** :
```cmd
ipconfig
# Cherchez "Adresse IPv4"
```

**Mac/Linux** :
```bash
ifconfig
# ou
ip addr show
```

### Configurer l'URL API

Dans `src/api/client.js`, remplacez :
```javascript
const API_URL = 'http://YOUR_IP:8000/api/mobile';
// Exemple: http://192.168.1.100:8000/api/mobile
```

---

## 🚀 Prochaines Étapes

1. **Maintenant** : Initialiser le projet React Native
2. **Ensuite** : Créer les écrans un par un
3. **Puis** : Intégrer avec l'API
4. **Enfin** : Tester et déployer

---

## 📞 Ressources Utiles

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [API Mobile Documentation](../backend/Documentation/API_MOBILE.md)

---

## ✅ Checklist de Départ

- [ ] Node.js installé
- [ ] Backend Laravel fonctionne
- [ ] API testée avec curl/Postman
- [ ] Expo CLI installé
- [ ] Projet créé
- [ ] Dépendances installées
- [ ] Structure de dossiers créée
- [ ] Premier écran de connexion fonctionnel

---

**Bonne chance pour la Phase 2 ! 🚀📱**
