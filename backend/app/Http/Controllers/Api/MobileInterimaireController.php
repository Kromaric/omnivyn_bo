<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interimaire;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class MobileInterimaireController extends Controller
{
    /**
     * Inscription d'un nouvel intérimaire depuis l'app mobile
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'nom_complet' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|unique:interimaires,email',
            'password' => 'required|string|min:8|confirmed',
            'telephone' => 'required|string',
            'date_naissance' => 'required|date',
            'adresse' => 'required|string',
            'competences' => 'nullable|array',
            'experience_annees' => 'nullable|integer',
        ]);

        // Créer l'utilisateur
        $user = User::create([
            'name' => $request->nom_complet,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'interimaire',
        ]);

        // Créer le profil intérimaire
        $interimaire = Interimaire::create([
            'user_id' => $user->id,
            'nom_complet' => $request->nom_complet,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'date_naissance' => $request->date_naissance,
            'adresse' => $request->adresse,
            'competences' => $request->competences ?? [],
            'experience_annees' => $request->experience_annees ?? 0,
            'disponibilite' => 'disponible',
            'statut' => 'disponible',
        ]);

        // Créer le token
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => $user,
            'interimaire' => $interimaire,
            'token' => $token,
        ], 201);
    }

    /**
     * Connexion depuis l'app mobile
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Vérifier les identifiants
        $user = User::where('email', $request->email)
            ->where('role', 'interimaire')
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        // Récupérer le profil intérimaire
        $interimaire = $user->interimaire;

        if (!$interimaire) {
            return response()->json([
                'message' => 'Profil intérimaire non trouvé',
            ], 404);
        }

        // Créer un nouveau token
        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'interimaire' => $interimaire,
            'token' => $token,
        ]);
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie',
        ]);
    }

    /**
     * Récupérer le profil de l'intérimaire connecté
     */
    public function profile(): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire()->with(['documents', 'missions'])->first();

        if (!$interimaire) {
            return response()->json([
                'message' => 'Profil non trouvé',
            ], 404);
        }

        return response()->json([
            'user' => $user,
            'interimaire' => $interimaire,
        ]);
    }

    /**
     * Mettre à jour le profil
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire;

        $request->validate([
            'nom_complet' => 'sometimes|string|max:255',
            'telephone' => 'sometimes|string',
            'adresse' => 'sometimes|string',
            'competences' => 'sometimes|array',
            'experience_annees' => 'sometimes|integer',
            'taux_horaire_souhaite' => 'sometimes|numeric',
            'disponibilite' => 'sometimes|in:disponible,occupe,indisponible',
        ]);

        $interimaire->update($request->only([
            'nom_complet',
            'telephone',
            'adresse',
            'competences',
            'experience_annees',
            'taux_horaire_souhaite',
            'disponibilite',
        ]));

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'interimaire' => $interimaire->fresh(),
        ]);
    }

    /**
     * Liste des missions disponibles (ouvertes)
     */
    public function missionsDisponibles(Request $request): JsonResponse
    {
        $query = Mission::where('statut', 'ouverte')
            ->whereNull('interimaire_id')
            ->with(['entreprise']);

        // Filtres optionnels
        if ($request->has('competence')) {
            $query->whereJsonContains('competences_requises', $request->competence);
        }

        if ($request->has('lieu')) {
            $query->where('lieu', 'like', '%' . $request->lieu . '%');
        }

        if ($request->has('taux_min')) {
            $query->where('taux_horaire', '>=', $request->taux_min);
        }

        // Tri par date de création (les plus récentes en premier)
        $query->orderBy('created_at', 'desc');

        $perPage = $request->get('per_page', 15);
        $missions = $query->paginate($perPage);

        return response()->json($missions);
    }

    /**
     * Détails d'une mission disponible
     */
    public function missionDetails(string $id): JsonResponse
    {
        $mission = Mission::with(['entreprise'])->findOrFail($id);

        return response()->json($mission);
    }

    /**
     * Postuler à une mission
     */
    public function postulerMission(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire;

        $mission = Mission::findOrFail($id);

        // Vérifier que la mission est ouverte
        if ($mission->statut !== 'ouverte') {
            return response()->json([
                'message' => 'Cette mission n\'est plus disponible',
            ], 400);
        }

        // Vérifier que la mission n'a pas déjà un intérimaire
        if ($mission->interimaire_id) {
            return response()->json([
                'message' => 'Cette mission est déjà assignée',
            ], 400);
        }

        // Vérifier que l'intérimaire est disponible
        if ($interimaire->statut !== 'disponible') {
            return response()->json([
                'message' => 'Vous devez être disponible pour postuler',
            ], 400);
        }

        // Assigner la mission (on peut aussi créer une table candidatures si on veut un système de validation)
        $mission->update([
            'interimaire_id' => $interimaire->id,
            'statut' => 'en_cours',
        ]);

        // Mettre à jour le statut de l'intérimaire
        $interimaire->update([
            'statut' => 'en_mission',
        ]);

        return response()->json([
            'message' => 'Candidature envoyée avec succès',
            'mission' => $mission->fresh(['entreprise']),
        ]);
    }

    /**
     * Mes missions (en cours et terminées)
     */
    public function mesMissions(Request $request): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire;

        $query = Mission::where('interimaire_id', $interimaire->id)
            ->with(['entreprise']);

        // Filtrer par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        $query->orderBy('date_debut', 'desc');

        $perPage = $request->get('per_page', 15);
        $missions = $query->paginate($perPage);

        return response()->json($missions);
    }

    /**
     * Mes contrats
     */
    public function mesContrats(Request $request): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire;

        $contrats = $interimaire->contrats()
            ->with(['mission', 'entreprise'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($contrats);
    }

    /**
     * Détails d'un contrat
     */
    public function contratDetails(string $id): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire;

        $contrat = $interimaire->contrats()
            ->with(['mission', 'entreprise'])
            ->findOrFail($id);

        return response()->json($contrat);
    }

    /**
     * Signer un contrat
     */
    public function signerContrat(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire;

        $contrat = $interimaire->contrats()->findOrFail($id);

        if ($contrat->signature_interimaire) {
            return response()->json([
                'message' => 'Ce contrat est déjà signé',
            ], 400);
        }

        $request->validate([
            'signature' => 'required|string', // Peut être une image base64 ou un texte
        ]);

        $contrat->update([
            'signature_interimaire' => $request->signature,
            'date_signature_interimaire' => now(),
        ]);

        return response()->json([
            'message' => 'Contrat signé avec succès',
            'contrat' => $contrat->fresh(),
        ]);
    }

    /**
     * Mes paiements
     */
    public function mesPaiements(Request $request): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire;

        $paiements = $interimaire->paiements()
            ->with(['mission', 'entreprise'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($paiements);
    }

    /**
     * Mes documents
     */
    public function mesDocuments(Request $request): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire;

        $documents = $interimaire->documents()
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($documents);
    }

    /**
     * Upload d'un document
     */
    public function uploadDocument(Request $request): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire;

        $request->validate([
            'type' => 'required|in:cv,piece_identite,diplome,certification,autre',
            'nom' => 'required|string|max:255',
            'fichier' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('fichier');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('documents/interimaires', $filename, 'public');

        $document = $interimaire->documents()->create([
            'type' => $request->type,
            'nom' => $request->nom,
            'chemin' => $path,
            'url' => asset('storage/' . $path),
        ]);

        return response()->json([
            'message' => 'Document uploadé avec succès',
            'document' => $document,
        ], 201);
    }

    /**
     * Statistiques du dashboard
     */
    public function dashboard(): JsonResponse
    {
        $user = Auth::user();
        $interimaire = $user->interimaire;

        $stats = [
            'missions_total' => $interimaire->missions()->count(),
            'missions_en_cours' => $interimaire->missions()->where('statut', 'en_cours')->count(),
            'missions_terminees' => $interimaire->missions()->where('statut', 'terminee')->count(),
            'paiements_total' => $interimaire->paiements()->sum('montant'),
            'paiements_en_attente' => $interimaire->paiements()->where('statut', 'en_attente')->count(),
            'documents_total' => $interimaire->documents()->count(),
            'taux_horaire_moyen' => $interimaire->missions()->avg('taux_horaire'),
        ];

        // Missions récentes
        $missions_recentes = $interimaire->missions()
            ->with(['entreprise'])
            ->orderBy('date_debut', 'desc')
            ->limit(5)
            ->get();

        // Paiements récents
        $paiements_recents = $interimaire->paiements()
            ->with(['mission', 'entreprise'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'missions_recentes' => $missions_recentes,
            'paiements_recents' => $paiements_recents,
            'interimaire' => $interimaire,
        ]);
    }
}
