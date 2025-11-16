<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
         Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            // الربط بالمريض/المستخدم/الخدمة
            $table->unsignedBigInteger('patient_id')->nullable(false);
            $table->unsignedBigInteger('user_id')->nullable(false); // الطبيب/الموظف
            $table->unsignedBigInteger('service_id')->nullable(false);

            // التاريخ ووقت البداية والنهاية
            $table->date('date');
            $table->time('start_time'); // مثال: "09:00:00"
            $table->time('end_time');   // مثال: "10:30:00"

            // عدد الـ slots (كل slot = 30 دقيقة) — يخزن كرقم
            $table->unsignedSmallInteger('duration_slots')->default(1);

            // ملاحظات وحالة
            $table->text('notes')->nullable();
            $table->enum('status', ['scheduled', 'completed', 'canceled'])->default('scheduled');

            $table->timestamps();

            // فهارس تسريع الاستعلامات
            $table->index(['date']);
            $table->index(['user_id', 'date', 'start_time']);
            // ملاحظة: لا نضع unique على (date,start_time) لأننا قد نحتاج لتمييز حسب user/resource لاحقاً
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
