<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInterimaireRequest;
use App\Http\Requests\UpdateInterimaireRequest;
use App\Models\Interimaire;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InterimaireController extends Controller
{
    /**
     * Liste tous les intérimaires
     */
    public function index(Request $request): JsonResponse
    {
        $query = Interimaire::query();

        // Filtrer par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Filtrer par disponibilité
        if ($request->has('disponibilite')) {
            $query->where('disponibilite', $request->disponibilite);
        }

        // Recherche par nom
        if ($request->has('search')) {
            $query->where('nom_complet', 'like', '%' . $request->search . '%');
        }

        // Filtrer par compétences
        if ($request->has('competence')) {
            $query->whereJsonContains('competences', $request->competence);
        }

        // Tri
        $sortField = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        // Charger les relations
        $query->with('user');

        // Utiliser per_page si fourni, sinon retourner tout
        $perPage = $request->get('per_page');
        if ($perPage) {
            $interimaires = $query->paginate($perPage);
            return response()->json($interimaires);
        }

        $interimaires = $query->get();
        return response()->json($interimaires);
    }

    /**
     * Créer un nouveau intérimaire
     */
    public function store(StoreInterimaireRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Ajouter user_id seulement si l'utilisateur est authentifié
        if (auth()->check()) {
            $data['user_id'] = auth()->id();
        }
        
        $interimaire = Interimaire::create($data);

        return response()->json([
            'message' => 'Intérimaire créé avec succès',
            'interimaire' => $interimaire->load('user')
        ], 201);
    }

    /**
     * Afficher un intérimaire
     */
    public function show(string $id): JsonResponse
    {
        $interimaire = Interimaire::with(['user', 'missions', 'paiements', 'documents'])->findOrFail($id);

        return response()->json($interimaire);
    }

    /**
     * Mettre à jour un intérimaire
     */
    public function update(UpdateInterimaireRequest $request, string $id): JsonResponse
    {
        $interimaire = Interimaire::findOrFail($id);
        $interimaire->update($request->validated());

        return response()->json([
            'message' => 'Intérimaire mis à jour avec succès',
            'interimaire' => $interimaire->load('user')
        ]);
    }

    /**
     * Supprimer un intérimaire
     */
    public function destroy(string $id): JsonResponse
    {
        $interimaire = Interimaire::findOrFail($id);
        $interimaire->delete();

        return response()->json([
            'message' => 'Intérimaire supprimé avec succès'
        ]);
    }

    /**
     * Récupérer les missions d'un intérimaire
     */
    public function missions(string $id): JsonResponse
    {
        $interimaire = Interimaire::findOrFail($id);
        $missions = $interimaire->missions()
            ->with(['entreprise'])
            ->paginate(15);

        return response()->json($missions);
    }

    /**
     * Récupérer les paiements d'un intérimaire
     */
    public function paiements(string $id): JsonResponse
    {
        $interimaire = Interimaire::findOrFail($id);
        $paiements = $interimaire->paiements()
            ->with(['mission', 'entreprise'])
            ->paginate(15);

        return response()->json($paiements);
    }

    /**
     * Récupérer les intérimaires disponibles
     */
    public function disponibles(): JsonResponse
    {
        $query = Interimaire::where('statut', 'disponible')->with('user');
        
        $perPage = request()->get('per_page');
        if ($perPage) {
            $interimaires = $query->paginate($perPage);
            return response()->json($interimaires);
        }
        
        $interimaires = $query->get();
        return response()->json($interimaires);
    }
}
