<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mission_id')->constrained('missions')->onDelete('cascade');
            $table->foreignId('interimaire_id')->constrained('interimaires')->onDelete('cascade');
            $table->foreignId('entreprise_id')->constrained('entreprises')->onDelete('cascade');
            $table->string('numero_contrat')->unique();
            $table->date('date_signature')->nullable();
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->enum('statut', ['brouillon', 'genere', 'envoye', 'signe', 'refuse', 'en_attente', 'actif', 'termine', 'resilie'])->default('brouillon');
            $table->text('conditions')->nullable();
            $table->string('document_url')->nullable();
            $table->decimal('salaire', 10, 2)->nullable();
            $table->string('type')->nullable();
            $table->text('signature_entreprise')->nullable();
            $table->text('signature_interimaire')->nullable();
            $table->timestamp('date_signature_entreprise')->nullable();
            $table->timestamp('date_signature_interimaire')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contrats');
    }
};
