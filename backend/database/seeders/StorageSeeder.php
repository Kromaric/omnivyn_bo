<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class StorageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer les dossiers nécessaires dans le storage public
        $directories = [
            'documents',
            'photos',
            'cv',
        ];

        foreach ($directories as $directory) {
            if (!Storage::disk('public')->exists($directory)) {
                Storage::disk('public')->makeDirectory($directory);
                $this->command->info("Dossier '{$directory}' créé dans storage/app/public/");
            }
        }

        $this->command->info("Structure de stockage vérifiée et créée.");
    }
}
