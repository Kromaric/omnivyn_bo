<?php

namespace Database\Factories;

use App\Models\Entreprise;
use App\Models\Interimaire;
use App\Models\Mission;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContratFactory extends Factory
{
    public function definition(): array
    {
        $dateDebut = fake()->dateTimeBetween('-1 month', '+2 months');
        $dateFin = fake()->dateTimeBetween($dateDebut, '+6 months');

        return [
            'mission_id' => Mission::factory(),
            'interimaire_id' => Interimaire::factory(),
            'entreprise_id' => Entreprise::factory(),
            'numero_contrat' => 'CTR-' . fake()->unique()->numerify('######'),
            'date_signature' => fake()->optional()->dateTimeBetween('-1 month', 'now'),
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            'statut' => fake()->randomElement(['brouillon', 'en_attente', 'signe', 'actif', 'termine', 'resilie']),
            'conditions' => fake()->paragraph(3),
            'document_url' => fake()->optional()->url(),
            'salaire' => fake()->randomFloat(2, 1500, 5000),
            'type' => fake()->randomElement(['journee', 'semaine', 'mois', 'longue_duree']),
            'signature_entreprise' => fake()->optional()->uuid(),
            'signature_interimaire' => fake()->optional()->uuid(),
            'date_signature_entreprise' => fake()->optional()->dateTimeBetween('-1 month', 'now'),
            'date_signature_interimaire' => fake()->optional()->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Contrat en brouillon
     */
    public function brouillon(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'brouillon',
            'date_signature' => null,
            'signature_entreprise' => null,
            'signature_interimaire' => null,
            'date_signature_entreprise' => null,
            'date_signature_interimaire' => null,
        ]);
    }

    /**
     * Contrat signé
     */
    public function signe(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'signe',
            'date_signature' => fake()->dateTimeBetween('-1 month', 'now'),
            'signature_entreprise' => 'signature_entreprise_' . fake()->uuid(),
            'signature_interimaire' => 'signature_interimaire_' . fake()->uuid(),
            'date_signature_entreprise' => fake()->dateTimeBetween('-1 month', 'now'),
            'date_signature_interimaire' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Contrat actif
     */
    public function actif(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'actif',
            'date_signature' => fake()->dateTimeBetween('-2 months', '-1 month'),
            'date_debut' => fake()->dateTimeBetween('-1 month', 'now'),
            'signature_entreprise' => 'signature_entreprise_' . fake()->uuid(),
            'signature_interimaire' => 'signature_interimaire_' . fake()->uuid(),
            'date_signature_entreprise' => fake()->dateTimeBetween('-2 months', '-1 month'),
            'date_signature_interimaire' => fake()->dateTimeBetween('-2 months', '-1 month'),
        ]);
    }
}
