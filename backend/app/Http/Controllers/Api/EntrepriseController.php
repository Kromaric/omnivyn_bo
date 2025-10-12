<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEntrepriseRequest;
use App\Http\Requests\UpdateEntrepriseRequest;
use App\Models\Entreprise;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EntrepriseController extends Controller
{
    /**
     * Liste toutes les entreprises
     */
    public function index(Request $request): JsonResponse
    {
        $query = Entreprise::query();

        // Filtrer par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Recherche par nom
        if ($request->has('search')) {
            $query->where('nom', 'like', '%' . $request->search . '%');
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
            $entreprises = $query->paginate($perPage);
            return response()->json($entreprises);
        }

        $entreprises = $query->get();
        return response()->json($entreprises);
    }

    /**
     * Créer une nouvelle entreprise
     */
    public function store(StoreEntrepriseRequest $request): JsonResponse
    {
        $data = $request->validated();
        
        // Ajouter user_id seulement si l'utilisateur est authentifié
        if (auth()->check()) {
            $data['user_id'] = auth()->id();
        }
        
        $entreprise = Entreprise::create($data);

        return response()->json([
            'message' => 'Entreprise créée avec succès',
            'entreprise' => $entreprise->load('user')
        ], 201);
    }

    /**
     * Afficher une entreprise
     */
    public function show(string $id): JsonResponse
    {
        $entreprise = Entreprise::with(['user', 'missions', 'paiements', 'documents'])->findOrFail($id);

        return response()->json($entreprise);
    }

    /**
     * Mettre à jour une entreprise
     */
    public function update(UpdateEntrepriseRequest $request, string $id): JsonResponse
    {
        $entreprise = Entreprise::findOrFail($id);
        $entreprise->update($request->validated());

        return response()->json([
            'message' => 'Entreprise mise à jour avec succès',
            'entreprise' => $entreprise->load('user')
        ]);
    }

    /**
     * Supprimer une entreprise
     */
    public function destroy(string $id): JsonResponse
    {
        $entreprise = Entreprise::findOrFail($id);
        $entreprise->delete();

        return response()->json([
            'message' => 'Entreprise supprimée avec succès'
        ]);
    }

    /**
     * Récupérer les missions d'une entreprise
     */
    public function missions(string $id): JsonResponse
    {
        $entreprise = Entreprise::findOrFail($id);
        $missions = $entreprise->missions()
            ->with(['interimaire', 'entreprise'])
            ->paginate(15);

        return response()->json($missions);
    }

    /**
     * Récupérer les paiements d'une entreprise
     */
    public function paiements(string $id): JsonResponse
    {
        $entreprise = Entreprise::findOrFail($id);
        $paiements = $entreprise->paiements()
            ->with(['mission', 'interimaire'])
            ->paginate(15);

        return response()->json($paiements);
    }
}
