<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class MedicalRecord extends Model
{
    use HasFactory;
    protected $fillable = [
        'patient_id',
        'procedure_id',
        'doctor_id',
        'date',
        'details',
        'attachments',
    ];
    public function patient() {
        return $this->belongsTo(Patient::class);
    }

    public function procedure() {
        return $this->belongsTo(Procedure::class);
    }

    public function doctor() {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}

