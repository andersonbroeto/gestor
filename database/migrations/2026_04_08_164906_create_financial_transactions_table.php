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
        Schema::create('financial_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('client_id')->nullable()->constrained('clients')->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('cascade');
            $table->enum('type', ['receita', 'despesa']);
            $table->decimal('value', 15, 2);
            $table->date('date');
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_transactions');
    }
};
