<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Procedure extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'cost',
        'duration_minutes',
        'follow_up_days',
        'tooth_id',
    ];
// علاقة غير مباشرة للمريض عبر السن
// public function patient()
// {
//     return $this->hasOneThrough(
//         Patient::class, // النموذج النهائي
//         Tooth::class,   // النموذج الوسيط
//         'id',           // المفتاح الأساسي في جدول الأسنان
//         'id',           // المفتاح الأساسي في جدول المرضى
//         'tooth_id',     // المفتاح الخارجي في جدول الإجراءات الذي يشير إلى السن
//         'patient_id'    // المفتاح الخارجي في جدول الأسنان الذي يشير إلى المريض
//     );
// }
// public function patient()
// {
//     return $this->belongsTo(Patient::class, 'patient_id');
// }

    public function tooth()
{
    return $this->belongsTo(Tooth::class, 'tooth_id');
}

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
    // علاقة مع المواعيد
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    // علاقة مع السجلات الطبية
    // public function medicalRecords()
    // {
    //     return $this->hasMany(MedicalRecord::class);
    // }

    // علاقة مع عناصر الفواتير
    // public function invoiceItems()
    // {
    //     return $this->hasMany(InvoiceItem::class);
    // }
}
