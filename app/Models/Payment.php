<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'amount',
        'payment_date',
        'paid_at',
        'notes'
    ];

    // public function procedure()
    // {
    //     return $this->belongsTo(Procedure::class);
    // }
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
