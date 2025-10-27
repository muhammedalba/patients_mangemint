<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;
    public function procedure()
    {
        return $this->belongsTo(Procedure::class);
    }
    // public function invoice()
    // {
    //     return $this->belongsTo(Invoice::class);
    // }
}
