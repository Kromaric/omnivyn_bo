<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->foreignId('entreprise_id')->constrained('entreprises')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->decimal('taux_horaire', 8, 2);
            $table->enum('statut', ['ouverte', 'en_cours', 'terminee', 'annulee'])->default('ouverte');
            $table->json('competences_requises')->nullable();
            $table->foreignId('interimaire_id')->nullable()->constrained('interimaires')->onDelete('set null');
            $table->string('lieu')->nullable();
            $table->enum('type_contrat', ['journee', 'semaine', 'mois', 'longue_duree'])->default('journee');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('missions');
    }
};
