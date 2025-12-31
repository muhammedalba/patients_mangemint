<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('service_id')
                ->nullable()
                ->constrained('services')
                ->nullOnDelete();



            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');

            $table->unsignedSmallInteger('duration_slots')->default(1);

            $table->text('notes')->nullable()->default('معاينة');
            $table->enum('status', ['scheduled', 'completed', 'canceled'])->default('scheduled');

            $table->timestamps();
            $table->index(
                ['user_id', 'date', 'start_time', 'end_time', 'patient_id', 'status'],
                'appointments_multi_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
