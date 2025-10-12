<?php

namespace Database\Seeders;

use App\Models\Contrat;
use App\Models\Mission;
use Illuminate\Database\Seeder;

class ContratSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer les missions en cours et terminées avec intérimaires
        $missions = Mission::whereIn('statut', ['en_cours', 'terminee'])
            ->whereNotNull('interimaire_id')
            ->get();

        foreach ($missions as $mission) {
            Contrat::create([
                'mission_id' => $mission->id,
                'interimaire_id' => $mission->interimaire_id,
                'entreprise_id' => $mission->entreprise_id,
                'numero_contrat' => 'CNT-' . fake()->unique()->numerify('######'),
                'date_signature' => fake()->dateTimeBetween('-3 months', '-1 month'),
                'date_debut' => $mission->date_debut,
                'date_fin' => $mission->date_fin,
                'statut' => $mission->statut === 'terminee' ? 'termine' : 'actif',
                'conditions' => fake()->paragraph(3),
                'document_url' => fake()->url(),
                'salaire' => $mission->taux_horaire * 35 * 4, // Salaire mensuel approximatif
                'type' => $mission->type_contrat,
                'signature_entreprise' => 'signature_entreprise_' . fake()->uuid(),
                'signature_interimaire' => 'signature_interimaire_' . fake()->uuid(),
                'date_signature_entreprise' => fake()->dateTimeBetween('-3 months', '-1 month'),
                'date_signature_interimaire' => fake()->dateTimeBetween('-3 months', '-1 month'),
            ]);
        }

        // Créer des contrats supplémentaires avec factory
        Contrat::factory(15)->create();
    }
}
