<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InterimaireFactory extends Factory
{
    public function definition(): array
    {
        $competencesList = [
            'PHP', 'Laravel', 'JavaScript', 'React', 'Vue.js', 'Node.js',
            'Maçonnerie', 'Électricité', 'Plomberie', 'Menuiserie',
            'Service en salle', 'Cuisine', 'Barman',
            'Comptabilité', 'Vente', 'Marketing', 'Gestion de projet',
            'Logistique', 'Conduite de chariot', 'Préparation de commandes',
            'Soins infirmiers', 'Aide soignant', 'Secrétariat médical'
        ];

        return [
            'user_id' => User::factory(),
            'nom_complet' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'telephone' => fake()->phoneNumber(),
            'date_naissance' => fake()->dateTimeBetween('-50 years', '-18 years'),
            'adresse' => fake()->address(),
            'competences' => fake()->randomElements($competencesList, fake()->numberBetween(2, 5)),
            'experience_annees' => fake()->numberBetween(0, 20),
            'disponibilite' => fake()->randomElement(['immediat', 'une_semaine', 'deux_semaines', 'un_mois']),
            'statut' => fake()->randomElement(['disponible', 'en_mission', 'indisponible']),
            'taux_horaire_souhaite' => fake()->randomFloat(2, 12, 50),
            'photo_url' => fake()->imageUrl(200, 200, 'people'),
            'cv_url' => fake()->url(),
            'note' => fake()->randomFloat(1, 0, 5),
        ];
    }

    /**
     * Intérimaire disponible immédiatement
     */
    public function disponible(): static
    {
        return $this->state(fn (array $attributes) => [
            'disponibilite' => 'immediat',
            'statut' => 'disponible',
        ]);
    }

    /**
     * Intérimaire en mission
     */
    public function enMission(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'en_mission',
        ]);
    }

    /**
     * Intérimaire avec bonne note
     */
    public function bonneNote(): static
    {
        return $this->state(fn (array $attributes) => [
            'note' => fake()->randomFloat(1, 4.0, 5.0),
        ]);
    }
}
