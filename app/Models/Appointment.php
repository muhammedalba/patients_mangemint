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
        'procedure_id',
        'appointment_date',
        'times',
        'notes',
        'status',
    ];

    protected $casts = [
        'times' => 'array',
    ];
    public function patient() {
        return $this->belongsTo(Patient::class);
    }

    public function procedure() {
        return $this->belongsTo(Procedure::class);
    }

    public function doctor() {
        return $this->belongsTo(User::class, 'user_id');
    }
}

