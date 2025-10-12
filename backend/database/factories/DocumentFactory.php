<?php

namespace Database\Factories;

use App\Models\Entreprise;
use App\Models\Interimaire;
use App\Models\Mission;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    public function definition(): array
    {
        // Choisir aléatoirement un type d'entité
        $documentableType = fake()->randomElement([
            'App\Models\Entreprise',
            'App\Models\Interimaire',
            'App\Models\Mission',
        ]);

        // Récupérer un ID aléatoire de l'entité choisie
        $documentableId = match($documentableType) {
            'App\Models\Entreprise' => Entreprise::inRandomOrder()->first()?->id ?? Entreprise::factory()->create()->id,
            'App\Models\Interimaire' => Interimaire::inRandomOrder()->first()?->id ?? Interimaire::factory()->create()->id,
            'App\Models\Mission' => Mission::inRandomOrder()->first()?->id ?? Mission::factory()->create()->id,
        };

        return [
            'nom' => fake()->word() . '_' . fake()->word(),
            'type' => fake()->randomElement(['CV', 'Contrat', 'Facture', 'Attestation', 'Certificat', 'Rapport']),
            'fichier_url' => fake()->url(),
            'documentable_type' => $documentableType,
            'documentable_id' => $documentableId,
            'taille' => fake()->numberBetween(100, 5000) . ' KB',
            'mime_type' => fake()->randomElement(['application/pdf', 'application/msword', 'image/jpeg', 'image/png']),
        ];
    }

    /**
     * Document de type CV
     */
    public function cv(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'CV',
            'mime_type' => 'application/pdf',
        ]);
    }

    /**
     * Document de type contrat
     */
    public function contrat(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'Contrat',
            'mime_type' => 'application/pdf',
        ]);
    }

    /**
     * Document de type facture
     */
    public function facture(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'Facture',
            'mime_type' => 'application/pdf',
        ]);
    }
}
