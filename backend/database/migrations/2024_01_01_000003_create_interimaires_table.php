<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interimaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('nom_complet');
            $table->string('email');
            $table->string('telephone');
            $table->date('date_naissance')->nullable();
            $table->text('adresse')->nullable();
            $table->json('competences')->nullable();
            $table->integer('experience_annees')->nullable();
            $table->enum('disponibilite', ['immediat', 'une_semaine', 'deux_semaines', 'un_mois'])->default('immediat');
            $table->enum('statut', ['disponible', 'en_mission', 'indisponible'])->default('disponible');
            $table->decimal('taux_horaire_souhaite', 8, 2)->nullable();
            $table->string('photo_url')->nullable();
            $table->string('cv_url')->nullable();
            $table->decimal('note', 2, 1)->nullable()->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interimaires');
    }
};
