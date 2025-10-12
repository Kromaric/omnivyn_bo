<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mission_id')->constrained('missions')->onDelete('cascade');
            $table->foreignId('interimaire_id')->constrained('interimaires')->onDelete('cascade');
            $table->foreignId('entreprise_id')->constrained('entreprises')->onDelete('cascade');
            $table->decimal('montant', 10, 2);
            $table->date('date_paiement')->nullable();
            $table->enum('statut', ['en_attente', 'valide', 'paye', 'annule'])->default('en_attente');
            $table->date('periode_debut')->nullable();
            $table->date('periode_fin')->nullable();
            $table->decimal('heures_travaillees', 8, 2)->nullable();
            $table->decimal('taux_horaire', 8, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
