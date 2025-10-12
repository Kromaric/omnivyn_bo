<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'max:255'],
            'entreprise_id' => ['required', 'exists:entreprises,id'],
            'description' => ['nullable', 'string'],
            'date_debut' => ['required', 'date'],
            'date_fin' => ['nullable', 'date', 'after:date_debut'],
            'taux_horaire' => ['required', 'numeric', 'min:0'],
            'statut' => ['nullable', 'in:ouverte,en_cours,terminee,annulee'],
            'competences_requises' => ['nullable', 'array'],
            'competences_requises.*' => ['string'],
            'interimaire_id' => ['nullable', 'exists:interimaires,id'],
            'lieu' => ['nullable', 'string', 'max:255'],
            'type_contrat' => ['nullable', 'in:journee,semaine,mois,longue_duree'],
        ];
    }
}
