<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
      Schema::create('patients', function (Blueprint $table) {
    $table->id();
    $table->string('name', 60);
    $table->string('email', 60)->unique()->nullable();
    $table->timestamp('email_verified_at')->nullable();
    $table->enum('gender', ['male', 'female', 'other'])->nullable();
    $table->date('birth_date');
    $table->string('phone', 15)->nullable();
    $table->string('address', 300)->nullable();
    $table->text('notes')->nullable();
    $table->string('password', 20)->nullable(); 
    $table->timestamps();
});

    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
