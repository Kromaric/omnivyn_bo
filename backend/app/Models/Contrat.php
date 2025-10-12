<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    use HasFactory;

    protected $fillable = [
        'mission_id',
        'interimaire_id',
        'entreprise_id',
        'numero_contrat',
        'date_signature',
        'date_debut',
        'date_fin',
        'statut',
        'conditions',
        'document_url',
        'salaire',
        'type',
        'signature_entreprise',
        'signature_interimaire',
        'date_signature_entreprise',
        'date_signature_interimaire',
    ];

    protected $casts = [
        'date_signature' => 'date',
        'date_debut' => 'date',
        'date_fin' => 'date',
        'date_signature_entreprise' => 'datetime',
        'date_signature_interimaire' => 'datetime',
        'salaire' => 'decimal:2',
    ];

    protected $appends = [
        'interimaire_nom',
        'mission_titre',
        'entreprise_nom',
        'date_generation',
        'url_document'
    ];

    // Relations
    public function mission()
    {
        return $this->belongsTo(Mission::class);
    }

    public function interimaire()
    {
        return $this->belongsTo(Interimaire::class);
    }

    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    // Accessors pour le frontend
    public function getInterimaireNomAttribute()
    {
        return $this->interimaire ? $this->interimaire->nom_complet : null;
    }

    public function getMissionTitreAttribute()
    {
        return $this->mission ? $this->mission->titre : null;
    }

    public function getEntrepriseNomAttribute()
    {
        return $this->entreprise ? $this->entreprise->nom : null;
    }

    public function getDateGenerationAttribute()
    {
        return $this->created_at;
    }

    public function getUrlDocumentAttribute()
    {
        return $this->document_url;
    }
}
