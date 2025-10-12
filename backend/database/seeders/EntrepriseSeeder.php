<?php

namespace Database\Seeders;

use App\Models\Entreprise;
use App\Models\User;
use Illuminate\Database\Seeder;

class EntrepriseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les utilisateurs de type entreprise
        $entrepriseUsers = User::where('role', 'entreprise')->get();

        // Créer des entreprises pour ces utilisateurs
        if ($entrepriseUsers->count() > 0) {
            foreach ($entrepriseUsers as $user) {
                Entreprise::create([
                    'user_id' => $user->id,
                    'nom' => $user->name,
                    'secteur' => fake()->randomElement(['Technologie', 'Construction', 'Restauration', 'Commerce', 'Services']),
                    'adresse' => fake()->address(),
                    'contact_nom' => $user->name,
                    'contact_email' => $user->email,
                    'contact_telephone' => fake()->phoneNumber(),
                    'siret' => fake()->numerify('##############'),
                    'nombre_missions' => rand(0, 20),
                    'statut' => 'actif',
                    'logo_url' => fake()->imageUrl(200, 200, 'business'),
                ]);
            }
        }

        // Créer des entreprises supplémentaires avec factory
        Entreprise::factory(15)->actif()->create();
        Entreprise::factory(5)->create(['statut' => 'inactif']);
    }
}
