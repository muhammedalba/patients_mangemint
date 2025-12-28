<?php

namespace App\Domain\Expenses\Repositories;

use App\Models\Expense;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class ExpenseRepository
{
    public function query()
    {
        return Expense::query()->select('id', 'amount', 'description', 'expense_category_id', 'payment_method', 'created_by', 'is_locked', 'expense_date', 'created_at');
    }

    public function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "expenses.page.{$page}.search." . ($search ?? '');

        $store = Cache::getStore();

        $build = function () use ($search, $perPage) {

            $q = $this->query()->with(['category:id,name,type', 'createdBy:id,name']);

            if ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('description', 'like', "%{$search}%")
                        ->orWhereHas('category', fn($q2) => $q2->where('name', 'like', "%{$search}%"));
                });
            }

            return $q->latest()->orderByDesc('updated_at')->paginate($perPage)->withQueryString();
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('expenses')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }

    public function create(array $data): Expense
    {

        $expense = Expense::create($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('expenses')->flush();
        } else {
            Cache::flush();
        }

        return $expense;
    }

    public function update(Expense $expense, array $data): bool
    {
        if ($expense->is_locked) {
            return false;
        }

        $updated = $expense->update($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('expenses')->flush();
        } else {
            Cache::flush();
        }

        return $updated;
    }

    public function delete(Expense $expense): bool
    {
        if ($expense->is_locked) {
            return false;
        }

        $deleted = $expense->delete();

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('expenses')->flush();
        } else {
            Cache::flush();
        }

        return $deleted;
    }
}
