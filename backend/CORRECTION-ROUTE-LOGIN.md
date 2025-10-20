# 🔧 CORRECTION: Erreur "Route [login] not defined"

## ❌ Problème Initial

```
Symfony\Component\Routing\Exception\RouteNotFoundException
Route [login] not defined.
```

Cette erreur se produisait lors de l'accès à `/api/mobile/dashboard` sans token d'authentification.

## 🔍 Cause du Problème

Lorsqu'une route API protégée par `auth:sanctum` est appelée sans authentification, Laravel essaie de rediriger vers `route('login')`. Mais cette route n'existait pas, causant l'erreur.

**Le problème :** Pour une API REST, on ne doit PAS rediriger, mais retourner une réponse JSON 401.

## ✅ Solution Appliquée

### 1. Création du Middleware Authenticate personnalisé

**Fichier:** `backend/app/Http/Middleware/Authenticate.php`

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        // Pour les routes API, retourner null = pas de redirection
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }
        
        return route('login');
    }

    protected function unauthenticated($request, array $guards)
    {
        // Pour les routes API, retourner JSON 401
        if ($request->expectsJson() || $request->is('api/*')) {
            abort(response()->json([
                'success' => false,
                'message' => 'Non authentifié. Veuillez vous connecter.',
                'error' => 'Unauthenticated'
            ], 401));
        }
        
        parent::unauthenticated($request, $guards);
    }
}
```

### 2. Configuration dans bootstrap/app.php

**Ajouté:**
- Alias du middleware `auth`
- Gestion des exceptions d'authentification pour retourner JSON

```php
->withMiddleware(function (Middleware $middleware): void {
    // ... autre config ...
    
    $middleware->alias([
        'auth' => \App\Http\Middleware\Authenticate::class,
    ]);
})
->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié. Veuillez vous connecter.',
                'error' => 'Unauthenticated'
            ], 401);
        }
    });
})
```

### 3. Ajout d'une route login de secours

**Fichier:** `backend/routes/web.php`

```php
Route::get('/login', function () {
    return response()->json([
        'message' => 'Cette route est pour l\'interface web. Utilisez /api/login ou /api/mobile/login pour l\'API.'
    ], 200);
})->name('login');
```

## 🧪 Tester la Correction

### Test 1: Accès sans authentification (doit retourner JSON 401)

```bash
curl -X GET http://127.0.0.1:8000/api/mobile/dashboard \
  -H "Accept: application/json"
```

**Réponse attendue:**
```json
{
  "success": false,
  "message": "Non authentifié. Veuillez vous connecter.",
  "error": "Unauthenticated"
}
```

### Test 2: Connexion et accès au dashboard

**Étape 1 - Login:**
```bash
curl -X POST http://127.0.0.1:8000/api/mobile/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "interim1@example.com",
    "password": "password"
  }'
```

**Étape 2 - Dashboard avec token:**
```bash
curl -X GET http://127.0.0.1:8000/api/mobile/dashboard \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -H "Accept: application/json"
```

### Utiliser les scripts de test automatiques

**Linux/Mac:**
```bash
cd backend
chmod +x test-mobile-api.sh
./test-mobile-api.sh
```

**Windows:**
```bash
cd backend
test-mobile-api.bat
```

## 📋 Checklist de Vérification

- [x] Middleware Authenticate créé
- [x] bootstrap/app.php configuré
- [x] Route login de secours ajoutée
- [x] Scripts de test créés
- [x] Gestion des exceptions API configurée

## 🎯 Résultat

Maintenant, lorsqu'un utilisateur non authentifié essaie d'accéder à une route API protégée:

1. ✅ **Avant:** Erreur "Route [login] not defined"
2. ✅ **Après:** Réponse JSON 401 propre avec message clair

## 🚀 Prochaines Étapes

1. **Redémarrer le serveur Laravel**
   ```bash
   cd backend
   php artisan serve --port=8000
   ```

2. **Tester l'API mobile**
   - Lancer un des scripts de test
   - Ou utiliser Postman/Insomnia

3. **Continuer le développement**
   - Développer l'app mobile React Native
   - Implémenter les écrans de login/register
   - Connecter avec l'API

## 💡 Notes Importantes

- **Toujours envoyer** le header `Accept: application/json` dans vos requêtes API
- **Token Sanctum** expire après un certain temps (configurable)
- **Les routes `/api/*`** retournent maintenant toujours du JSON, jamais de HTML
- **Utiliser `auth:sanctum`** et non `auth` pour les routes API

## 🆘 En Cas de Problème

1. **Vérifier que le serveur est lancé**
   ```bash
   php artisan serve --port=8000
   ```

2. **Vérifier les logs Laravel**
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Vérifier que l'utilisateur de test existe**
   ```bash
   php artisan tinker
   >>> User::where('email', 'interim1@example.com')->first();
   ```

4. **Vider le cache**
   ```bash
   php artisan config:clear
   php artisan route:clear
   php artisan cache:clear
   ```

---

✅ **Correction terminée avec succès !**
