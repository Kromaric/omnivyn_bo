<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // D'abord, appliquer la modification de la colonne enum
        DB::statement("ALTER TABLE contrats MODIFY COLUMN statut ENUM('brouillon', 'genere', 'envoye', 'signe', 'refuse', 'en_attente', 'actif', 'termine', 'resilie') DEFAULT 'brouillon'");

        // Ensuite, mettre à jour les statuts existants
        $updates = [
            'en_attente' => 'envoye',
            'actif' => 'signe',
            'termine' => 'signe',
            'resilie' => 'refuse',
        ];

        foreach ($updates as $oldStatut => $newStatut) {
            DB::table('contrats')
                ->where('statut', $oldStatut)
                ->update(['statut' => $newStatut]);
        }
    }

    public function down(): void
    {
        // Remettre les anciens statuts
        $updates = [
            'envoye' => 'en_attente',
            'genere' => 'brouillon',
            'refuse' => 'resilie',
        ];

        foreach ($updates as $newStatut => $oldStatut) {
            DB::table('contrats')
                ->where('statut', $newStatut)
                ->update(['statut' => $oldStatut]);
        }

        // Puis remettre l'ancienne définition de l'enum
        DB::statement("ALTER TABLE contrats MODIFY COLUMN statut ENUM('brouillon', 'en_attente', 'signe', 'actif', 'termine', 'resilie') DEFAULT 'brouillon'");
    }
};
