<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaiementRequest;
use App\Http\Requests\UpdatePaiementRequest;
use App\Models\Paiement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    /**
     * Liste tous les paiements
     */
    public function index(Request $request): JsonResponse
    {
        $query = Paiement::query();

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

        // Filtrer par mission
        if ($request->has('mission_id')) {
            $query->where('mission_id', $request->mission_id);
        }

        // Tri
        $sortField = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        // Charger les relations
        $query->with(['mission', 'interimaire', 'entreprise']);

        // Utiliser per_page si fourni, sinon retourner tout
        $perPage = $request->get('per_page');
        if ($perPage) {
            $paiements = $query->paginate($perPage);
            return response()->json($paiements);
        }

        $paiements = $query->get();
        return response()->json($paiements);
    }

    /**
     * Créer un nouveau paiement
     */
    public function store(StorePaiementRequest $request): JsonResponse
    {
        $paiement = Paiement::create($request->validated());

        return response()->json([
            'message' => 'Paiement créé avec succès',
            'paiement' => $paiement->load(['mission', 'interimaire', 'entreprise'])
        ], 201);
    }

    /**
     * Afficher un paiement
     */
    public function show(string $id): JsonResponse
    {
        $paiement = Paiement::with(['mission', 'interimaire', 'entreprise'])
            ->findOrFail($id);

        return response()->json($paiement);
    }

    /**
     * Mettre à jour un paiement
     */
    public function update(UpdatePaiementRequest $request, string $id): JsonResponse
    {
        $paiement = Paiement::findOrFail($id);
        $paiement->update($request->validated());

        return response()->json([
            'message' => 'Paiement mis à jour avec succès',
            'paiement' => $paiement->load(['mission', 'interimaire', 'entreprise'])
        ]);
    }

    /**
     * Supprimer un paiement
     */
    public function destroy(string $id): JsonResponse
    {
        $paiement = Paiement::findOrFail($id);
        $paiement->delete();

        return response()->json([
            'message' => 'Paiement supprimé avec succès'
        ]);
    }

    /**
     * Valider un paiement
     */
    public function valider(string $id): JsonResponse
    {
        $paiement = Paiement::findOrFail($id);

        if ($paiement->statut !== 'en_attente') {
            return response()->json([
                'message' => 'Ce paiement ne peut pas être validé'
            ], 400);
        }

        $paiement->update(['statut' => 'valide']);

        return response()->json([
            'message' => 'Paiement validé avec succès',
            'paiement' => $paiement->load(['mission', 'interimaire', 'entreprise'])
        ]);
    }

    /**
     * Marquer un paiement comme payé
     */
    public function payer(string $id): JsonResponse
    {
        $paiement = Paiement::findOrFail($id);

        if ($paiement->statut !== 'valide') {
            return response()->json([
                'message' => 'Ce paiement doit être validé avant d\'être payé'
            ], 400);
        }

        $paiement->update([
            'statut' => 'paye',
            'date_paiement' => now()
        ]);

        return response()->json([
            'message' => 'Paiement effectué avec succès',
            'paiement' => $paiement->load(['mission', 'interimaire', 'entreprise'])
        ]);
    }
}
