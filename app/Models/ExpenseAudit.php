<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpenseAudit extends Model
{
    protected $fillable = [
        'expense_id',
        'old_amount',
        'new_amount',
        'changed_by',
        'reason',
        'changed_at',
    ];
    public function expense()
    {
        return $this->belongsTo(Expense::class);
    }
    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
