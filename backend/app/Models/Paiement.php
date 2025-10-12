<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'mission_id',
        'interimaire_id',
        'entreprise_id',
        'montant',
        'date_paiement',
        'statut',
        'periode_debut',
        'periode_fin',
        'heures_travaillees',
        'taux_horaire',
        'notes',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_paiement' => 'date',
        'periode_debut' => 'date',
        'periode_fin' => 'date',
        'heures_travaillees' => 'decimal:2',
        'taux_horaire' => 'decimal:2',
    ];

    protected $appends = [
        'interimaire_nom',
        'mission_titre',
        'entreprise_nom'
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
}
