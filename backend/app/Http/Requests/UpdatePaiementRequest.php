<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaiementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mission_id' => ['sometimes', 'exists:missions,id'],
            'interimaire_id' => ['sometimes', 'exists:interimaires,id'],
            'entreprise_id' => ['sometimes', 'exists:entreprises,id'],
            'montant' => ['sometimes', 'numeric', 'min:0'],
            'date_paiement' => ['sometimes', 'nullable', 'date'],
            'statut' => ['sometimes', 'in:en_attente,valide,paye,annule'],
            'periode_debut' => ['sometimes', 'nullable', 'date'],
            'periode_fin' => ['sometimes', 'nullable', 'date', 'after:periode_debut'],
            'heures_travaillees' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'taux_horaire' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
