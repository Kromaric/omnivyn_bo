<?php

use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'Laravel fonctionne !',
        'sanctum' => class_exists('Laravel\Sanctum\Sanctum'),
        'user_model' => class_exists('App\Models\User'),
        'database' => DB::connection()->getPdo() ? 'Connectée' : 'Erreur',
    ]);
});
