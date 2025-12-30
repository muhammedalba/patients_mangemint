<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MonthClosure extends Model
{
    protected $fillable = [
        'year',
        'month',
        'closed_by',
        'closed_at',
    ];
    public function closedBy()
    {
        return $this->belongsTo(User::class, 'closed_by');
    }
}
