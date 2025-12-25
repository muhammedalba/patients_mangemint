<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('procedures', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->text('description')->nullable();

            $table->timestamp('processing_date')->useCurrent();
            $table->decimal('cost', 10, 2)->default(0);
            $table->integer('duration_minutes')->nullable();
            $table->integer('follow_up_days')->nullable();
            $table->unsignedBigInteger('tooth_id')->nullable()->index();

            $table->foreign('tooth_id')
                ->references('id')
                ->on('teeth')
                ->nullOnDelete();

            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->fullText('description');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procedures');
    }
};
