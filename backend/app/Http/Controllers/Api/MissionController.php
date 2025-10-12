<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMissionRequest;
use App\Http\Requests\UpdateMissionRequest;
use App\Models\Mission;
use App\Models\Interimaire;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MissionController extends Controller
{
    /**
     * Liste toutes les missions
     */
    public function index(Request $request): JsonResponse
    {
        $query = Mission::query();

        // Filtrer par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Filtrer par entreprise
        if ($request->has('entreprise_id')) {
            $query->where('entreprise_id', $request->entreprise_id);
        }

        // Filtrer par intérimaire
        if ($request->has('interimaire_id')) {
            $query->where('interimaire_id', $request->interimaire_id);
        }

        // Recherche par titre
        if ($request->has('search')) {
            $query->where('titre', 'like', '%' . $request->search . '%');
        }

        $missions = $query->with(['entreprise', 'interimaire'])->paginate(15);

        return response()->json($missions);
    }

    /**
     * Créer une nouvelle mission
     */
    public function store(StoreMissionRequest $request): JsonResponse
    {
        $mission = Mission::create($request->validated());

        return response()->json([
            'message' => 'Mission créée avec succès',
            'mission' => $mission->load(['entreprise', 'interimaire'])
        ], 201);
    }

    /**
     * Afficher une mission
     */
    public function show(string $id): JsonResponse
    {
        $mission = Mission::with(['entreprise', 'interimaire', 'paiements', 'contrats', 'documents'])
            ->findOrFail($id);

        return response()->json($mission);
    }

    /**
     * Mettre à jour une mission
     */
    public function update(UpdateMissionRequest $request, string $id): JsonResponse
    {
        $mission = Mission::findOrFail($id);
        $mission->update($request->validated());

        return response()->json([
            'message' => 'Mission mise à jour avec succès',
            'mission' => $mission->load(['entreprise', 'interimaire'])
        ]);
    }

    /**
     * Supprimer une mission
     */
    public function destroy(string $id): JsonResponse
    {
        $mission = Mission::findOrFail($id);
        $mission->delete();

        return response()->json([
            'message' => 'Mission supprimée avec succès'
        ]);
    }

    /**
     * Assigner un intérimaire à une mission
     */
    public function assignerInterimaire(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'interimaire_id' => 'required|exists:interimaires,id'
        ]);

        $mission = Mission::findOrFail($id);
        $interimaire = Interimaire::findOrFail($request->interimaire_id);

        // Vérifier que la mission est ouverte
        if ($mission->statut !== 'ouverte') {
            return response()->json([
                'message' => 'Cette mission n\'est pas ouverte'
            ], 400);
        }

        // Vérifier que l'intérimaire est disponible
        if ($interimaire->statut !== 'disponible') {
            return response()->json([
                'message' => 'Cet intérimaire n\'est pas disponible'
            ], 400);
        }

        // Assigner l'intérimaire
        $mission->update([
            'interimaire_id' => $request->interimaire_id,
            'statut' => 'en_cours'
        ]);

        // Mettre à jour le statut de l'intérimaire
        $interimaire->update([
            'statut' => 'en_mission'
        ]);

        return response()->json([
            'message' => 'Intérimaire assigné avec succès',
            'mission' => $mission->load(['entreprise', 'interimaire'])
        ]);
    }

    /**
     * Terminer une mission
     */
    public function terminer(string $id): JsonResponse
    {
        $mission = Mission::findOrFail($id);

        if ($mission->statut !== 'en_cours') {
            return response()->json([
                'message' => 'Cette mission n\'est pas en cours'
            ], 400);
        }

        $mission->update(['statut' => 'terminee']);

        // Mettre à jour le statut de l'intérimaire
        if ($mission->interimaire) {
            $mission->interimaire->update([
                'statut' => 'disponible'
            ]);
        }

        return response()->json([
            'message' => 'Mission terminée avec succès',
            'mission' => $mission->load(['entreprise', 'interimaire'])
        ]);
    }

    /**
     * Récupérer les missions ouvertes
     */
    public function ouvertes(): JsonResponse
    {
        $missions = Mission::where('statut', 'ouverte')
            ->with(['entreprise'])
            ->paginate(15);

        return response()->json($missions);
    }
}
