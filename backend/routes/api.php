<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EntrepriseController;
use App\Http\Controllers\Api\InterimaireController;
use App\Http\Controllers\Api\MissionController;
use App\Http\Controllers\Api\PaiementController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\ContratController;
use App\Http\Controllers\Api\MobileInterimaireController;

// ========================================
// ROUTES WEB APP (Admin & Entreprises)
// ========================================

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Entreprises
    Route::apiResource('entreprises', EntrepriseController::class);
    Route::get('entreprises/{id}/missions', [EntrepriseController::class, 'missions']);
    Route::get('entreprises/{id}/paiements', [EntrepriseController::class, 'paiements']);
    
    // Interimaires
    Route::apiResource('interimaires', InterimaireController::class);
    Route::get('interimaires/{id}/missions', [InterimaireController::class, 'missions']);
    Route::get('interimaires/{id}/paiements', [InterimaireController::class, 'paiements']);
    Route::get('interimaires/disponibles', [InterimaireController::class, 'disponibles']);
    
    // Missions
    Route::apiResource('missions', MissionController::class);
    Route::post('missions/{id}/assigner', [MissionController::class, 'assignerInterimaire']);
    Route::post('missions/{id}/terminer', [MissionController::class, 'terminer']);
    Route::get('missions/ouvertes', [MissionController::class, 'ouvertes']);
    
    // Paiements
    Route::apiResource('paiements', PaiementController::class);
    Route::post('paiements/{id}/valider', [PaiementController::class, 'valider']);
    Route::post('paiements/{id}/payer', [PaiementController::class, 'payer']);
    
    // Documents
    Route::apiResource('documents', DocumentController::class);
    Route::post('documents/upload', [DocumentController::class, 'upload']);
    
    // Contrats
    Route::apiResource('contrats', ContratController::class);
    Route::post('contrats/{id}/signer-entreprise', [ContratController::class, 'signerEntreprise']);
    Route::post('contrats/{id}/signer-interimaire', [ContratController::class, 'signerInterimaire']);
});

// ========================================
// ROUTES MOBILE APP (Intérimaires)
// ========================================

Route::prefix('mobile')->group(function () {
    
    // Routes publiques
    Route::post('/register', [MobileInterimaireController::class, 'register']);
    Route::post('/login', [MobileInterimaireController::class, 'login']);
    
    // Routes protégées
    Route::middleware('auth:sanctum')->group(function () {
        
        // Authentification
        Route::post('/logout', [MobileInterimaireController::class, 'logout']);
        Route::get('/profile', [MobileInterimaireController::class, 'profile']);
        Route::put('/profile', [MobileInterimaireController::class, 'updateProfile']);
        
        // Dashboard
        Route::get('/dashboard', [MobileInterimaireController::class, 'dashboard']);
        
        // Missions
        Route::get('/missions/disponibles', [MobileInterimaireController::class, 'missionsDisponibles']);
        Route::get('/missions/{id}', [MobileInterimaireController::class, 'missionDetails']);
        Route::post('/missions/{id}/postuler', [MobileInterimaireController::class, 'postulerMission']);
        Route::get('/mes-missions', [MobileInterimaireController::class, 'mesMissions']);
        
        // Contrats
        Route::get('/contrats', [MobileInterimaireController::class, 'mesContrats']);
        Route::get('/contrats/{id}', [MobileInterimaireController::class, 'contratDetails']);
        Route::post('/contrats/{id}/signer', [MobileInterimaireController::class, 'signerContrat']);
        
        // Paiements
        Route::get('/paiements', [MobileInterimaireController::class, 'mesPaiements']);
        
        // Documents
        Route::get('/documents', [MobileInterimaireController::class, 'mesDocuments']);
        Route::post('/documents/upload', [MobileInterimaireController::class, 'uploadDocument']);
    });
});
