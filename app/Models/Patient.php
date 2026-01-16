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
        'discount_amount',
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

    // public function procedures()
    // {
    //     return $this->hasManyThrough(
    //         Procedure::class, // الموديل البعيد
    //         Tooth::class,     // الموديل الوسيط
    //         'patient_id',     // المفتاح الأجنبي في جدول الأسنان
    //         'tooth_id',       // المفتاح الأجنبي في جدول الإجراءات
    //         'id',             // المفتاح الأساسي في جدول المرضى
    //         'id'              // المفتاح الأساسي في جدول الأسنان
    //     );
    // }
    public function procedures()
    {
        return $this->hasMany(Procedure::class, 'patient_id');
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function medicalRecord()
    {
        return $this->hasOne(MedicalRecord::class);
    }

protected static function booted()
{
    static::created(function ($patient) {

        if ($patient->teeth()->exists()) {
            return;
        }

        $teethNumbers = [
            11,12,13,14,15,16,17,18,
            21,22,23,24,25,26,27,28,
            31,32,33,34,35,36,37,38,
            41,42,43,44,45,46,47,48,
        ];

        $patient->teeth()->createMany(
            collect($teethNumbers)->map(fn ($n) => [
                'tooth_number' => $n,
                'status' => 'healthy',
            ])->toArray()
        );
    });
}

}
