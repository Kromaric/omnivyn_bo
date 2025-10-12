<?php

namespace Database\Seeders;

use App\Models\Paiement;
use App\Models\Mission;
use Illuminate\Database\Seeder;

class PaiementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les missions terminées et en cours
        $missionsTerminees = Mission::where('statut', 'terminee')
            ->whereNotNull('interimaire_id')
            ->get();

        $missionsEnCours = Mission::where('statut', 'en_cours')
            ->whereNotNull('interimaire_id')
            ->take(5)
            ->get();

        // Créer des paiements pour les missions terminées
        foreach ($missionsTerminees as $mission) {
            Paiement::create([
                'mission_id' => $mission->id,
                'interimaire_id' => $mission->interimaire_id,
                'entreprise_id' => $mission->entreprise_id,
                'montant' => $mission->taux_horaire * fake()->numberBetween(35, 160),
                'date_paiement' => fake()->dateTimeBetween('-1 month', 'now'),
                'statut' => fake()->randomElement(['valide', 'paye']),
                'periode_debut' => $mission->date_debut,
                'periode_fin' => $mission->date_fin,
                'heures_travaillees' => fake()->numberBetween(35, 160),
                'taux_horaire' => $mission->taux_horaire,
                'notes' => fake()->optional()->sentence(),
            ]);
        }

        // Créer des paiements en attente pour les missions en cours
        foreach ($missionsEnCours as $mission) {
            Paiement::create([
                'mission_id' => $mission->id,
                'interimaire_id' => $mission->interimaire_id,
                'entreprise_id' => $mission->entreprise_id,
                'montant' => $mission->taux_horaire * fake()->numberBetween(35, 80),
                'date_paiement' => null,
                'statut' => 'en_attente',
                'periode_debut' => $mission->date_debut,
                'periode_fin' => now(),
                'heures_travaillees' => fake()->numberBetween(35, 80),
                'taux_horaire' => $mission->taux_horaire,
                'notes' => null,
            ]);
        }

        // Créer des paiements supplémentaires avec factory
        Paiement::factory(30)->create();
    }
}
