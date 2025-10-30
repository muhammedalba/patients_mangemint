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

    public function teeth() {
        return $this->hasMany(Tooth::class);
    }

    public function appointments() {
        return $this->hasMany(Appointment::class);
    }

    public function procedures()
    {
        return $this->hasManyThrough(Procedure::class, Tooth::class);
    }

    // public function invoices() {
    //     return $this->hasMany(Invoice::class);
    // }

//     public function medicalRecords() {
//         return $this->hasMany(MedicalRecord::class);
//     }
}
