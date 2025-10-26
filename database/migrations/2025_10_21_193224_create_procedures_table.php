<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('procedures', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('cost', 10, 2)->default(0);
            $table->integer('duration_minutes')->nullable();
            $table->integer('follow_up_days')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('procedures');
    }
};
