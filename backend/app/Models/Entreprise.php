<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nom',
        'secteur',
        'adresse',
        'contact_nom',
        'contact_email',
        'contact_telephone',
        'siret',
        'nombre_missions',
        'statut',
        'logo_url',
    ];

    protected $casts = [
        'nombre_missions' => 'integer',
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
        return $this->morphMany(Document::class, 'documentable');
    }
}
