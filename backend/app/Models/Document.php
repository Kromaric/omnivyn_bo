<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'interimaire_id',
        'nom',
        'type',
        'fichier_url',
        'date_validite',
        'statut',
        'notes',
        'documentable_type',
        'documentable_id',
        'taille',
        'mime_type',
    ];

    protected $casts = [
        'date_validite' => 'date',
    ];

    protected $appends = [
        'nom_fichier',
        'type_document',
        'url_fichier',
        'date_upload',
        'interimaire_nom'
    ];

    // Relations polymorphiques
    public function documentable()
    {
        return $this->morphTo();
    }

    public function interimaire()
    {
        return $this->belongsTo(Interimaire::class);
    }

    // Accessors pour le frontend
    public function getNomFichierAttribute()
    {
        return $this->nom;
    }

    public function getTypeDocumentAttribute()
    {
        return $this->type;
    }

    public function getUrlFichierAttribute()
    {
        return $this->fichier_url;
    }

    public function getDateUploadAttribute()
    {
        return $this->created_at;
    }

    public function getInterimaireNomAttribute()
    {
        return $this->interimaire ? $this->interimaire->nom_complet : null;
    }
}
