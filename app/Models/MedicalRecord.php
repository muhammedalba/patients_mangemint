<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class MedicalRecord extends Model
{
    use HasFactory;
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'attachments',
        'images',
        'chief_complaint',
        'present_illness_history',
        'past_dental_history',
        'has_cardiovascular_disease',
        'has_hypertension',
        'has_respiratory_disease',
        'has_gastrointestinal_disease',
        'has_neural_disease',
        'has_hepatic_disease',
        'has_renal_disease',
        'has_endocrine_disease',
        'has_diabetes',
        'medical_disease_details',
        'allergic_to',
        'current_medications',
        'hospitalized_or_operated',
        'hospital_details',
        'abnormal_bleeding_history',
        'is_pregnant',
        'pregnancy_trimester',
        'clinical_notes',
    ];
    protected $casts = [
        'images' => 'array',
        'attachments' => 'array',
    ];

public function patient() {
    return $this->belongsTo(Patient::class);
}

public function procedures() {
    return $this->hasMany(Procedure::class);
}

    public function doctor() {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}

