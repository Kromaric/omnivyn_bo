<?php

namespace Database\Seeders;

use App\Models\Interimaire;
use App\Models\User;
use Illuminate\Database\Seeder;

class InterimaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les utilisateurs de type intérimaire
        $interimaireUsers = User::where('role', 'interimaire')->get();

        // Créer des intérimaires pour ces utilisateurs
        if ($interimaireUsers->count() > 0) {
            foreach ($interimaireUsers as $user) {
                Interimaire::create([
                    'user_id' => $user->id,
                    'nom_complet' => $user->name,
                    'email' => $user->email,
                    'telephone' => fake()->phoneNumber(),
                    'date_naissance' => fake()->dateTimeBetween('-50 years', '-18 years'),
                    'adresse' => fake()->address(),
                    'competences' => fake()->randomElements(['PHP', 'Laravel', 'JavaScript', 'React', 'Maçonnerie'], 3),
                    'experience_annees' => rand(0, 15),
                    'disponibilite' => 'immediat',
                    'statut' => 'disponible',
                    'taux_horaire_souhaite' => fake()->randomFloat(2, 15, 40),
                    'photo_url' => fake()->imageUrl(200, 200, 'people'),
                    'cv_url' => fake()->url(),
                    'note' => fake()->randomFloat(1, 3.0, 5.0),
                ]);
            }
        }

        // Créer des intérimaires supplémentaires avec factory
        Interimaire::factory(30)->disponible()->create();
        Interimaire::factory(10)->enMission()->create();
        Interimaire::factory(5)->create(['statut' => 'indisponible']);
    }
}
