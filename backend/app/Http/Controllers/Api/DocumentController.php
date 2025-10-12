<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Liste tous les documents
     */
    public function index(Request $request): JsonResponse
    {
        $query = Document::query();

        // Filtrer par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtrer par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Filtrer par intérimaire
        if ($request->has('interimaire_id')) {
            $query->where('interimaire_id', $request->interimaire_id);
        }

        // Filtrer par entité
        if ($request->has('documentable_type') && $request->has('documentable_id')) {
            $query->where('documentable_type', $request->documentable_type)
                  ->where('documentable_id', $request->documentable_id);
        }

        // Tri
        $sortField = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        // Charger les relations
        $query->with(['documentable', 'interimaire']);

        // Utiliser per_page si fourni, sinon retourner tout
        $perPage = $request->get('per_page');
        if ($perPage) {
            $documents = $query->paginate($perPage);
            return response()->json($documents);
        }

        $documents = $query->get();
        return response()->json($documents);
    }

    /**
     * Upload un document
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240', // Max 10MB
            'nom' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'interimaire_id' => 'nullable|exists:interimaires,id',
            'date_validite' => 'nullable|date',
            'statut' => 'nullable|in:valide,expire,a_renouveler',
            'notes' => 'nullable|string',
            'documentable_type' => 'required|string',
            'documentable_id' => 'required|integer',
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');

        $document = Document::create([
            'nom' => $request->nom,
            'type' => $request->type,
            'fichier_url' => Storage::url($path),
            'interimaire_id' => $request->interimaire_id,
            'date_validite' => $request->date_validite,
            'statut' => $request->statut ?? 'valide',
            'notes' => $request->notes,
            'documentable_type' => $request->documentable_type,
            'documentable_id' => $request->documentable_id,
            'taille' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        return response()->json([
            'message' => 'Document uploadé avec succès',
            'document' => $document->load(['documentable', 'interimaire'])
        ], 201);
    }

    /**
     * Créer un document (sans upload)
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|string|max:50',
            'fichier_url' => 'required|string',
            'interimaire_id' => 'nullable|exists:interimaires,id',
            'date_validite' => 'nullable|date',
            'statut' => 'nullable|in:valide,expire,a_renouveler',
            'notes' => 'nullable|string',
            'documentable_type' => 'required|string',
            'documentable_id' => 'required|integer',
            'taille' => 'nullable|integer',
            'mime_type' => 'nullable|string',
        ]);

        $document = Document::create($request->all());

        return response()->json([
            'message' => 'Document créé avec succès',
            'document' => $document->load(['documentable', 'interimaire'])
        ], 201);
    }

    /**
     * Afficher un document
     */
    public function show(string $id): JsonResponse
    {
        $document = Document::with(['documentable', 'interimaire'])->findOrFail($id);

        return response()->json($document);
    }

    /**
     * Mettre à jour un document
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:50',
            'date_validite' => 'sometimes|date',
            'statut' => 'sometimes|in:valide,expire,a_renouveler',
            'notes' => 'sometimes|string',
        ]);

        $document = Document::findOrFail($id);
        $document->update($request->only(['nom', 'type', 'date_validite', 'statut', 'notes']));

        return response()->json([
            'message' => 'Document mis à jour avec succès',
            'document' => $document->load(['documentable', 'interimaire'])
        ]);
    }

    /**
     * Supprimer un document
     */
    public function destroy(string $id): JsonResponse
    {
        $document = Document::findOrFail($id);

        // Supprimer le fichier du storage
        if ($document->fichier_url) {
            $path = str_replace('/storage/', '', $document->fichier_url);
            Storage::disk('public')->delete($path);
        }

        $document->delete();

        return response()->json([
            'message' => 'Document supprimé avec succès'
        ]);
    }
}
