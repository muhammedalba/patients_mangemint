<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Payment extends Model
{
    use HasFactory;

    public function invoice() {
        return $this->belongsTo(Invoice::class);
    }
}

