<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();


            $table->unsignedBigInteger('patient_id')->nullable(false);
            $table->unsignedBigInteger('user_id')->nullable(false);
            $table->unsignedBigInteger('service_id')->nullable(false);


            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');

            $table->unsignedSmallInteger('duration_slots')->default(1);

            $table->text('notes')->nullable();
            $table->enum('status', ['scheduled', 'completed', 'canceled'])->default('scheduled');

            $table->timestamps();

            $table->index('patient_id');
            $table->index('service_id');
            $table->index('status');
            $table->index('date');
            $table->index(['user_id', 'date', 'start_time','end_time']);

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
