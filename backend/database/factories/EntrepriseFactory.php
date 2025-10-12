<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EntrepriseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nom' => fake()->company(),
            'secteur' => fake()->randomElement([
                'Technologie',
                'Construction',
                'Restauration',
                'Commerce',
                'Industrie',
                'Services',
                'Santé',
                'Transport',
                'Logistique',
                'Finance'
            ]),
            'adresse' => fake()->address(),
            'contact_nom' => fake()->name(),
            'contact_email' => fake()->unique()->companyEmail(),
            'contact_telephone' => fake()->phoneNumber(),
            'siret' => fake()->numerify('##############'),
            'nombre_missions' => fake()->numberBetween(0, 50),
            'statut' => fake()->randomElement(['actif', 'inactif']),
            'logo_url' => fake()->imageUrl(200, 200, 'business'),
        ];
    }

    /**
     * Entreprise active
     */
    public function actif(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'actif',
        ]);
    }

    /**
     * Entreprise avec beaucoup de missions
     */
    public function avecMissions(): static
    {
        return $this->state(fn (array $attributes) => [
            'nombre_missions' => fake()->numberBetween(20, 100),
        ]);
    }
}
