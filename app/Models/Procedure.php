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
    ];

    // علاقة مع المواعيد
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    // علاقة مع السجلات الطبية
    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    // علاقة مع عناصر الفواتير
    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
