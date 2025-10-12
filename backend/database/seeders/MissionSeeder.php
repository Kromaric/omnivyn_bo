<?php

namespace Database\Seeders;

use App\Models\Mission;
use App\Models\Entreprise;
use App\Models\Interimaire;
use Illuminate\Database\Seeder;

class MissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer quelques entreprises et intérimaires
        $entreprises = Entreprise::where('statut', 'actif')->take(10)->get();
        $interimairesDisponibles = Interimaire::where('statut', 'disponible')->take(5)->get();
        $interimairesEnMission = Interimaire::where('statut', 'en_mission')->take(5)->get();

        if ($entreprises->count() > 0) {
            // Missions ouvertes (sans intérimaire)
            foreach ($entreprises->take(5) as $entreprise) {
                Mission::factory()->ouverte()->create([
                    'entreprise_id' => $entreprise->id,
                ]);
            }

            // Missions en cours (avec intérimaire)
            foreach ($entreprises->take(5) as $index => $entreprise) {
                if ($interimairesDisponibles->count() > $index) {
                    Mission::factory()->enCours()->create([
                        'entreprise_id' => $entreprise->id,
                        'interimaire_id' => $interimairesDisponibles[$index]->id,
                    ]);
                }
            }

            // Missions terminées
            foreach ($entreprises->take(3) as $entreprise) {
                Mission::factory()->terminee()->create([
                    'entreprise_id' => $entreprise->id,
                ]);
            }
        }

        // Créer des missions supplémentaires avec factory
        Mission::factory(40)->create();
    }
}
