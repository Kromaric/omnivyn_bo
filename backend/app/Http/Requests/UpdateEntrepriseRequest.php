<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEntrepriseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['sometimes', 'string', 'max:255'],
            'secteur' => ['nullable', 'string', 'max:255'],
            'adresse' => ['nullable', 'string'],
            'contact_nom' => ['sometimes', 'string', 'max:255'],
            'contact_email' => ['sometimes', 'email', 'max:255'],
            'contact_telephone' => ['nullable', 'string', 'max:20'],
            'siret' => ['nullable', 'string', 'max:14', Rule::unique('entreprises')->ignore($this->entreprise)],
            'statut' => ['nullable', 'in:actif,inactif'],
            'logo_url' => ['nullable', 'url'],
        ];
    }
}
