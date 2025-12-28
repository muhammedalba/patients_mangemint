<?php

namespace App\Domain\ExpenseAudits\Repositories;

use App\Models\ExpenseAudit;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class ExpenseAuditRepository
{
    public function listByExpense(int $expenseId)
    {
        $cacheKey = "expense_audits.expense.{$expenseId}";
        $store = Cache::getStore();

        $build = function () use ($expenseId) {
            return ExpenseAudit::where('expense_id', $expenseId)->orderByDesc('changed_at')->get();
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('expense_audits')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }

    public function create(array $data): ExpenseAudit
    {
        $audit = ExpenseAudit::create($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('expense_audits')->flush();
        } else {
            Cache::flush();
        }

        return $audit;
    }
}
