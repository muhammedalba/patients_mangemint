<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'address',
        'notes',
        'birth_date',
        'gender',
        'marital_status',
    ];
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    public function teeth()
    {
        return $this->hasMany(Tooth::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function procedures()
    {
        return $this->hasManyThrough(
            Procedure::class, // الموديل البعيد
            Tooth::class,     // الموديل الوسيط
            'patient_id',     // المفتاح الأجنبي في جدول الأسنان
            'tooth_id',       // المفتاح الأجنبي في جدول الإجراءات
            'id',             // المفتاح الأساسي في جدول المرضى
            'id'              // المفتاح الأساسي في جدول الأسنان
        );
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function medicalRecord()
    {
        return $this->hasOne(MedicalRecord::class);
    }
}
