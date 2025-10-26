<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class InvoiceItem extends Model
{
    use HasFactory;

    public function invoice() {
        return $this->belongsTo(Invoice::class);
    }

    public function procedure() {
        return $this->belongsTo(Procedure::class);
    }
}

