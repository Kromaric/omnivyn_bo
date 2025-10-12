<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin Omnivyn',
            'email' => 'admin@omnivyn.fr',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Entreprises
        User::create([
            'name' => 'Tech Solutions',
            'email' => 'contact@techsolutions.fr',
            'password' => Hash::make('password'),
            'role' => 'entreprise',
        ]);

        User::create([
            'name' => 'Bâti Pro',
            'email' => 'contact@batipro.fr',
            'password' => Hash::make('password'),
            'role' => 'entreprise',
        ]);

        User::create([
            'name' => 'Restaurant Le Gourmet',
            'email' => 'contact@legourmet.fr',
            'password' => Hash::make('password'),
            'role' => 'entreprise',
        ]);

        // Intérimaires
        User::create([
            'name' => 'Jean Dupont',
            'email' => 'jean.dupont@example.fr',
            'password' => Hash::make('password'),
            'role' => 'interimaire',
        ]);

        User::create([
            'name' => 'Marie Martin',
            'email' => 'marie.martin@example.fr',
            'password' => Hash::make('password'),
            'role' => 'interimaire',
        ]);

        User::create([
            'name' => 'Pierre Dubois',
            'email' => 'pierre.dubois@example.fr',
            'password' => Hash::make('password'),
            'role' => 'interimaire',
        ]);

        // Créer des utilisateurs supplémentaires avec factory
        User::factory(10)->create();
    }
}
