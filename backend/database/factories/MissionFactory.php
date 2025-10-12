<?php

namespace Database\Factories;

use App\Models\Entreprise;
use App\Models\Interimaire;
use Illuminate\Database\Eloquent\Factories\Factory;

class MissionFactory extends Factory
{
    public function definition(): array
    {
        $dateDebut = fake()->dateTimeBetween('now', '+3 months');
        $dateFin = fake()->dateTimeBetween($dateDebut, '+6 months');

        $competencesList = [
            'PHP', 'Laravel', 'JavaScript', 'React', 'Vue.js',
            'Maçonnerie', 'Électricité', 'Plomberie',
            'Service en salle', 'Cuisine',
            'Comptabilité', 'Vente', 'Marketing',
            'Logistique', 'Conduite de chariot'
        ];

        return [
            'titre' => fake()->randomElement([
                'Développeur Full Stack',
                'Maçon qualifié',
                'Serveur expérimenté',
                'Électricien',
                'Assistant commercial',
                'Préparateur de commandes',
                'Chef de cuisine',
                'Plombier',
                'Agent logistique',
                'Comptable'
            ]),
            'entreprise_id' => Entreprise::factory(),
            'description' => fake()->paragraph(3),
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin,
            'taux_horaire' => fake()->randomFloat(2, 12, 45),
            'statut' => fake()->randomElement(['ouverte', 'en_cours', 'terminee', 'annulee']),
            'competences_requises' => fake()->randomElements($competencesList, fake()->numberBetween(1, 3)),
            'interimaire_id' => fake()->boolean(30) ? Interimaire::factory() : null,
            'lieu' => fake()->city(),
            'type_contrat' => fake()->randomElement(['journee', 'semaine', 'mois', 'longue_duree']),
        ];
    }

    /**
     * Mission ouverte sans intérimaire
     */
    public function ouverte(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'ouverte',
            'interimaire_id' => null,
        ]);
    }

    /**
     * Mission en cours avec intérimaire
     */
    public function enCours(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'en_cours',
            'interimaire_id' => Interimaire::factory(),
        ]);
    }

    /**
     * Mission terminée
     */
    public function terminee(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'terminee',
            'interimaire_id' => Interimaire::factory(),
            'date_debut' => fake()->dateTimeBetween('-6 months', '-3 months'),
            'date_fin' => fake()->dateTimeBetween('-3 months', '-1 month'),
        ]);
    }
}
