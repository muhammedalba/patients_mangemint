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
        'processing_date',
        'cost',
        'duration_minutes',
        'follow_up_days',
        'tooth_id',
        'patient_id',

    ];



    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function tooth()
    {
        return $this->belongsTo(Tooth::class, 'tooth_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }



}
