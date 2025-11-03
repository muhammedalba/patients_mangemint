<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tooth extends Model
{
    use HasFactory;
    // protected $table = 'teeth';

    protected $fillable = [
        'patient_id',
        'tooth_number',
        'status',
        'notes',
    ];
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
 public function procedures()
{
    return $this->hasMany(Procedure::class, 'tooth_id');
}


}
