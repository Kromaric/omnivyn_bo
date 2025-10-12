<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'entreprise_id',
        'description',
        'date_debut',
        'date_fin',
        'taux_horaire',
        'statut',
        'competences_requises',
        'interimaire_id',
        'lieu',
        'type_contrat',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'taux_horaire' => 'decimal:2',
        'competences_requises' => 'array',
    ];

    // Relations
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    public function interimaire()
    {
        return $this->belongsTo(Interimaire::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}
