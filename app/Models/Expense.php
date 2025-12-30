<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{

    protected $fillable = [
        'amount',
        'description',
        'expense_category_id',
        'payment_method',
        'created_by',
        'is_locked',
        'expense_date',
    ];

    public function category()
    {
        return $this->belongsTo(ExpenseCategory::class, 'expense_category_id');
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function audits()
    {
        return $this->hasMany(ExpenseAudit::class);
    }
}
