<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'user_id',
        'service_id',
        'date',
        'start_time',
        'end_time',
        'duration_slots',
        'notes',
        'status',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',  // سيحول التاريخ إلى 2025-11-24
        'start_time' => 'datetime:H:i',  // الوقت فقط
        'end_time' => 'datetime:H:i',
    ];

    // علاقات مساعدة
    public function patient()
    {
        return $this->belongsTo(\App\Models\Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function service()
    {
        return $this->belongsTo(\App\Models\Service::class);
    }
}
