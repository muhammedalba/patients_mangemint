<?php

namespace App\Domain\ExpenseAudits\Services;

use App\Domain\ExpenseAudits\DTOs\ExpenseAuditData;
use App\Domain\ExpenseAudits\Repositories\ExpenseAuditRepository;
use App\Models\ExpenseAudit;

class ExpenseAuditService
{
    public function __construct(private ExpenseAuditRepository $repository) {}

    public function listByExpense(int $expenseId)
    {
        return $this->repository->listByExpense($expenseId);
    }

    public function createAudit(ExpenseAuditData $data): ExpenseAudit
    {
        return $this->repository->create($data->toArray());
    }
}
