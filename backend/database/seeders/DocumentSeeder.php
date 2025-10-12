<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\Entreprise;
use App\Models\Interimaire;
use App\Models\Mission;
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Documents pour entreprises
        $entreprises = Entreprise::take(5)->get();
        foreach ($entreprises as $entreprise) {
            Document::create([
                'nom' => 'KBIS',
                'type' => 'legal',
                'fichier_url' => fake()->url(),
                'documentable_type' => 'App\Models\Entreprise',
                'documentable_id' => $entreprise->id,
                'taille' => fake()->numberBetween(100000, 5000000),
                'mime_type' => 'application/pdf',
            ]);
        }

        // Documents pour intérimaires
        $interimaires = Interimaire::take(10)->get();
        foreach ($interimaires as $interimaire) {
            // CV
            Document::create([
                'nom' => 'CV',
                'type' => 'cv',
                'fichier_url' => fake()->url(),
                'documentable_type' => 'App\Models\Interimaire',
                'documentable_id' => $interimaire->id,
                'taille' => fake()->numberBetween(100000, 2000000),
                'mime_type' => 'application/pdf',
            ]);

            // Pièce d'identité
            Document::create([
                'nom' => 'Carte d\'identité',
                'type' => 'identite',
                'fichier_url' => fake()->url(),
                'documentable_type' => 'App\Models\Interimaire',
                'documentable_id' => $interimaire->id,
                'taille' => fake()->numberBetween(500000, 2000000),
                'mime_type' => 'image/jpeg',
            ]);
        }

        // Documents pour missions
        $missions = Mission::take(5)->get();
        foreach ($missions as $mission) {
            Document::create([
                'nom' => 'Fiche de poste',
                'type' => 'mission',
                'fichier_url' => fake()->url(),
                'documentable_type' => 'App\Models\Mission',
                'documentable_id' => $mission->id,
                'taille' => fake()->numberBetween(100000, 1000000),
                'mime_type' => 'application/pdf',
            ]);
        }

        // Créer des documents supplémentaires avec factory
        Document::factory(20)->create();
    }
}
