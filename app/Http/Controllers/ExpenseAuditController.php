<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
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
        try {
            $data = ExpenseAuditData::fromArray($request->all());
            $this->service->createAudit($data);

            return redirect()->back()->with('success', __('Expense audit recorded.'));
        } catch (\Throwable $e) {
            Log::error('Failed to create expense audit', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString(), 'data' => $request->all()]);
            return redirect()->back()->withInput()->with('error', __('Something went wrong while creating expense audit.'));
        }
    }
}
