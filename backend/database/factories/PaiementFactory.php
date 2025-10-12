<?php

namespace Database\Factories;

use App\Models\Entreprise;
use App\Models\Interimaire;
use App\Models\Mission;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaiementFactory extends Factory
{
    public function definition(): array
    {
        $heuresTravaillees = fake()->randomFloat(2, 35, 160);
        $tauxHoraire = fake()->randomFloat(2, 12, 45);
        $montant = $heuresTravaillees * $tauxHoraire;

        $periodeDebut = fake()->dateTimeBetween('-2 months', 'now');
        $periodeFin = fake()->dateTimeBetween($periodeDebut, '+1 month');

        return [
            'mission_id' => Mission::factory(),
            'interimaire_id' => Interimaire::factory(),
            'entreprise_id' => Entreprise::factory(),
            'montant' => $montant,
            'date_paiement' => fake()->dateTimeBetween('now', '+1 month'),
            'statut' => fake()->randomElement(['en_attente', 'valide', 'paye', 'annule']),
            'periode_debut' => $periodeDebut,
            'periode_fin' => $periodeFin,
            'heures_travaillees' => $heuresTravaillees,
            'taux_horaire' => $tauxHoraire,
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Paiement en attente
     */
    public function enAttente(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'en_attente',
            'date_paiement' => null,
        ]);
    }

    /**
     * Paiement validé
     */
    public function valide(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'valide',
        ]);
    }

    /**
     * Paiement payé
     */
    public function paye(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'paye',
            'date_paiement' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }
}
