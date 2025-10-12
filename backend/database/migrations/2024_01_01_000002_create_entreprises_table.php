<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entreprises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->string('secteur')->nullable();
            $table->text('adresse')->nullable();
            $table->string('contact_nom');
            $table->string('contact_email');
            $table->string('contact_telephone')->nullable();
            $table->string('siret')->nullable()->unique();
            $table->integer('nombre_missions')->default(0);
            $table->enum('statut', ['actif', 'inactif'])->default('actif');
            $table->string('logo_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entreprises');
    }
};
