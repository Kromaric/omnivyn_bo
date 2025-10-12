<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->date('date_validite')->nullable()->after('fichier_url');
            $table->enum('statut', ['valide', 'expire', 'a_renouveler'])->default('valide')->after('date_validite');
            $table->foreignId('interimaire_id')->nullable()->constrained('interimaires')->onDelete('cascade')->after('id');
            $table->text('notes')->nullable()->after('statut');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['date_validite', 'statut', 'interimaire_id', 'notes']);
        });
    }
};
