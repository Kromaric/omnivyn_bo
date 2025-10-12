<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEntrepriseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'secteur' => ['nullable', 'string', 'max:255'],
            'adresse' => ['nullable', 'string'],
            'contact_nom' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'contact_telephone' => ['nullable', 'string', 'max:20'],
            'siret' => ['nullable', 'string', 'max:14', 'unique:entreprises'],
            'statut' => ['nullable', 'in:actif,inactif'],
            'logo_url' => ['nullable', 'url'],
        ];
    }
}
