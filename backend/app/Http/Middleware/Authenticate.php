<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Pour les routes API, on retourne null pour éviter la redirection
        // Laravel retournera automatiquement une réponse JSON 401
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // Pour les routes web classiques, rediriger vers login
        return route('login');
    }

    /**
     * Handle unauthenticated users.
     */
    protected function unauthenticated($request, array $guards)
    {
        // Pour les routes API, retourner une réponse JSON
        if ($request->expectsJson() || $request->is('api/*')) {
            abort(response()->json([
                'success' => false,
                'message' => 'Non authentifié. Veuillez vous connecter.',
                'error' => 'Unauthenticated'
            ], 401));
        }

        // Pour les autres routes, comportement par défaut
        parent::unauthenticated($request, $guards);
    }
}
