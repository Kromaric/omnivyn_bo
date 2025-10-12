<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interimaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nom_complet',
        'email',
        'telephone',
        'date_naissance',
        'adresse',
        'competences',
        'experience_annees',
        'disponibilite',
        'statut',
        'taux_horaire_souhaite',
        'photo_url',
        'cv_url',
        'note',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'competences' => 'array',
        'experience_annees' => 'integer',
        'taux_horaire_souhaite' => 'decimal:2',
        'note' => 'decimal:1',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function missions()
    {
        return $this->hasMany(Mission::class);
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
        return $this->hasMany(Document::class, 'interimaire_id');
    }

    // Relation polymorphique (pour les documents via documentable)
    public function documentsPolymorphic()
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}
