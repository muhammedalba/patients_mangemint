<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('procedure_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('doctor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('date');
            $table->text('details')->nullable();
            $table->json('attachments')->nullable(); // صور، تقارير...
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('medical_records');
    }
};
