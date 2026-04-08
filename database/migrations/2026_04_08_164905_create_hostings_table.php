<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hostings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->enum('plan', ['mensal', 'semestral', 'anual']);
            $table->decimal('value', 15, 2);
            $table->date('start_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hostings');
    }
};
