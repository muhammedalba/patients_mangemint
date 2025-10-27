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
        Schema::create('teeth', function (Blueprint $table) {
            $table->id();
            //  BILONGS TO PATIENT
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade')->onDelete('cascade');
            // tooth number
            $table->string('tooth_number');
            // status
            $table->string('status')->nullable();
            // notes
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teeth');
    }
};
