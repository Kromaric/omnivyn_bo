<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route login nommée (pour éviter l'erreur même si non utilisée pour l'API)
Route::get('/login', function () {
    return response()->json([
        'message' => 'Cette route est pour l\'interface web. Utilisez /api/login ou /api/mobile/login pour l\'API.'
    ], 200);
})->name('login');
