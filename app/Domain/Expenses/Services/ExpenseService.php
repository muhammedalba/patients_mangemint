<?php

namespace App\Domain\Expenses\Services;

use App\Domain\Expenses\DTOs\ExpenseData;
use App\Domain\Expenses\Repositories\ExpenseRepository;
use App\Models\Expense;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ExpenseService
{
    public function __construct(private ExpenseRepository $repository) {}

    public function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->list($search, $perPage);
    }

    public function createExpense(ExpenseData $data): Expense
    {
        $payload = array_merge($data->toArray(), [
            'created_by' => auth()->id(),
        ]);
        return $this->repository->create($payload);
    }

    public function updateExpense(Expense $expense, ExpenseData $data): bool
    {
        if ($expense->is_locked) {
            return false;
        }

        $payload = array_merge($data->toArray(), [
            'updated_by' => auth()->id(),
        ]);
        return $this->repository->update($expense, $payload);
    }

    public function deleteExpense(Expense $expense): bool
    {
        if ($expense->is_locked) {
            return false;
        }

        return $this->repository->delete($expense);
    }
}
