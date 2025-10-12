<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInterimaireRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom_complet' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'telephone' => ['required', 'string', 'max:20'],
            'date_naissance' => ['nullable', 'date'],
            'adresse' => ['nullable', 'string'],
            'competences' => ['nullable', 'array'],
            'competences.*' => ['string'],
            'experience_annees' => ['nullable', 'integer', 'min:0'],
            'disponibilite' => ['nullable', 'in:immediat,une_semaine,deux_semaines,un_mois'],
            'statut' => ['nullable', 'in:disponible,en_mission,indisponible'],
            'taux_horaire_souhaite' => ['nullable', 'numeric', 'min:0'],
            'photo_url' => ['nullable', 'url'],
            'cv_url' => ['nullable', 'url'],
            'note' => ['nullable', 'numeric', 'min:0', 'max:5'],
        ];
    }
}
