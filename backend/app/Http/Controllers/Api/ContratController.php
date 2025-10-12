<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contrat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContratController extends Controller
{
    /**
     * Liste tous les contrats
     */
    public function index(Request $request): JsonResponse
    {
        $query = Contrat::query();

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
            $contrats = $query->paginate($perPage);
            return response()->json($contrats);
        }

        $contrats = $query->get();
        return response()->json($contrats);
    }

    /**
     * Créer un nouveau contrat
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'mission_id' => 'required|exists:missions,id',
            'interimaire_id' => 'required|exists:interimaires,id',
            'entreprise_id' => 'required|exists:entreprises,id',
            'numero_contrat' => 'required|string|unique:contrats',
            'date_signature' => 'nullable|date',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after:date_debut',
            'statut' => 'nullable|string',
            'conditions' => 'nullable|string',
            'document_url' => 'nullable|string',
            'salaire' => 'nullable|numeric',
            'type' => 'nullable|string',
        ]);

        $contrat = Contrat::create($request->all());

        return response()->json([
            'message' => 'Contrat créé avec succès',
            'contrat' => $contrat->load(['mission', 'interimaire', 'entreprise'])
        ], 201);
    }

    /**
     * Afficher un contrat
     */
    public function show(string $id): JsonResponse
    {
        $contrat = Contrat::with(['mission', 'interimaire', 'entreprise'])
            ->findOrFail($id);

        return response()->json($contrat);
    }

    /**
     * Mettre à jour un contrat
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'date_signature' => 'sometimes|date',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'sometimes|date|after:date_debut',
            'statut' => 'sometimes|string',
            'conditions' => 'sometimes|string',
            'document_url' => 'sometimes|string',
            'salaire' => 'sometimes|numeric',
            'type' => 'sometimes|string',
        ]);

        $contrat = Contrat::findOrFail($id);
        $contrat->update($request->all());

        return response()->json([
            'message' => 'Contrat mis à jour avec succès',
            'contrat' => $contrat->load(['mission', 'interimaire', 'entreprise'])
        ]);
    }

    /**
     * Supprimer un contrat
     */
    public function destroy(string $id): JsonResponse
    {
        $contrat = Contrat::findOrFail($id);
        $contrat->delete();

        return response()->json([
            'message' => 'Contrat supprimé avec succès'
        ]);
    }

    /**
     * Signer le contrat par l'entreprise
     */
    public function signerEntreprise(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'signature' => 'required|string',
        ]);

        $contrat = Contrat::findOrFail($id);

        $contrat->update([
            'signature_entreprise' => $request->signature,
            'date_signature_entreprise' => now(),
        ]);

        // Si les deux parties ont signé, mettre à jour le statut
        if ($contrat->signature_interimaire && $contrat->signature_entreprise) {
            $contrat->update(['statut' => 'actif']);
        }

        return response()->json([
            'message' => 'Contrat signé par l\'entreprise avec succès',
            'contrat' => $contrat->load(['mission', 'interimaire', 'entreprise'])
        ]);
    }

    /**
     * Signer le contrat par l'intérimaire
     */
    public function signerInterimaire(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'signature' => 'required|string',
        ]);

        $contrat = Contrat::findOrFail($id);

        $contrat->update([
            'signature_interimaire' => $request->signature,
            'date_signature_interimaire' => now(),
        ]);

        // Si les deux parties ont signé, mettre à jour le statut
        if ($contrat->signature_interimaire && $contrat->signature_entreprise) {
            $contrat->update(['statut' => 'actif']);
        }

        return response()->json([
            'message' => 'Contrat signé par l\'intérimaire avec succès',
            'contrat' => $contrat->load(['mission', 'interimaire', 'entreprise'])
        ]);
    }
}
