<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaiementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mission_id' => ['required', 'exists:missions,id'],
            'interimaire_id' => ['required', 'exists:interimaires,id'],
            'entreprise_id' => ['required', 'exists:entreprises,id'],
            'montant' => ['required', 'numeric', 'min:0'],
            'date_paiement' => ['nullable', 'date'],
            'statut' => ['nullable', 'in:en_attente,valide,paye,annule'],
            'periode_debut' => ['nullable', 'date'],
            'periode_fin' => ['nullable', 'date', 'after:periode_debut'],
            'heures_travaillees' => ['nullable', 'numeric', 'min:0'],
            'taux_horaire' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
