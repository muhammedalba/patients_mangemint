<?php

namespace App\Http\Controllers;


use Inertia\Inertia;
use App\Models\Expense;
use App\Domain\ExpenseAudits\Services\ExpenseAuditService;
use App\Domain\ExpenseAudits\DTOs\ExpenseAuditData;
use App\Http\Requests\ExpenseAuditStoreRequest;

class ExpenseAuditController extends Controller
{
    public function __construct(private ExpenseAuditService $service) {}

    public function index(Expense $expense)
    {
        $audits = $this->service->listByExpense($expense->id);

        return Inertia::render('ExpenseAudits/Index', [
            'expense' => $expense,
            'audits' => $audits,
        ]);
    }

    public function store(ExpenseAuditStoreRequest $request)
    {

        $data = ExpenseAuditData::fromArray($request->all());
        $this->service->createAudit($data);

        return redirect()->back()->with('success', __('Expense audit recorded.'));
    }
}
