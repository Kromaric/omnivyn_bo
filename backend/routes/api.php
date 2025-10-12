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
