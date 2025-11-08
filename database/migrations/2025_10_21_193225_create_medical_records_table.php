<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
         Schema::create('medical_records', function (Blueprint $table) {
            $table->id();

            // كل مريض له سجل طبي واحد
            $table->foreignId('patient_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('doctor_id')->nullable()->constrained('users')->onDelete('set null');

            $table->json('attachments')->nullable();

            // التاريخ السني والطبي
            $table->text('chief_complaint')->nullable();
            $table->text('present_illness_history')->nullable();
            $table->text('past_dental_history')->nullable();

            // التاريخ الطبي العام
            $table->boolean('has_cardiovascular_disease')->default(false);
            $table->boolean('has_hypertension')->default(false);
            $table->boolean('has_respiratory_disease')->default(false);
            $table->boolean('has_gastrointestinal_disease')->default(false);
            $table->boolean('has_neural_disease')->default(false);
            $table->boolean('has_hepatic_disease')->default(false);
            $table->boolean('has_renal_disease')->default(false);
            $table->boolean('has_endocrine_disease')->default(false);
            $table->boolean('has_diabetes')->default(false);
            $table->text('medical_disease_details')->nullable();

            // الحساسية والأدوية
            $table->string('allergic_to')->nullable();
            $table->text('current_medications')->nullable();

            // الحالات الخاصة
            $table->boolean('hospitalized_or_operated')->default(false);
            $table->text('hospital_details')->nullable();
            $table->boolean('abnormal_bleeding_history')->default(false);
            $table->boolean('is_pregnant')->default(false);
            $table->enum('pregnancy_trimester', ['I', 'II', 'III'])->nullable();

            $table->text('clinical_notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
