<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Domain\Expenses\Services\ExpenseService;
use App\Domain\Expenses\DTOs\ExpenseData;
use Illuminate\Http\Request;
use App\Http\Requests\ExpenseStoreRequest;
use App\Http\Requests\ExpenseUpdateRequest;

class ExpenseController extends Controller
{
    public function __construct(private ExpenseService $service) {}

    public function index(Request $request)
    {
        $search = $request->query('search');
        $expenses = $this->service->list($search);

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        $categories = ExpenseCategory::select('id', 'name')->get();

        return Inertia::render('Expenses/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(ExpenseStoreRequest $request)
    {
        try {
            $data = ExpenseData::fromArray($request->validated());

            $this->service->createExpense($data);

            return redirect()->route('expenses.index')->with('success', __('Expense created successfully.'));
        } catch (\Throwable $e) {
            Log::error('Failed to create expense', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString(), 'data' => $request->validated()]);
            return redirect()->back()->withInput()->with('error', __('Something went wrong while creating the expense.'));
        }
    }

    public function edit(Expense $expense)
    {
        $categories = ExpenseCategory::select('id', 'name')->get();
        return Inertia::render('Expenses/Edit', [
            'expense' => $expense,
            'categories' => $categories,
        ]);
    }

    public function update(ExpenseUpdateRequest $request, Expense $expense)
    {
        try {
            $data = ExpenseData::fromArray($request->validated());

            $updated = $this->service->updateExpense($expense, $data);

            if (! $updated) {
                return redirect()->back()->withInput()->with('error', __('This expense belongs to a closed month and cannot be modified.'));
            }

            return redirect()->route('expenses.index')->with('success', __('Expense updated successfully.'));
        } catch (\Throwable $e) {
            Log::error('Failed to update expense', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString(), 'expense_id' => $expense->id, 'data' => $request->validated()]);
            return redirect()->back()->withInput()->with('error', __('Something went wrong while updating the expense.'));
        }
    }

    public function destroy(Expense $expense)
    {
        try {
            $deleted = $this->service->deleteExpense($expense);

            if (! $deleted) {
                return redirect()->back()->with('error', __('This expense belongs to a closed month and cannot be deleted.'));
            }

            return redirect()->route('expenses.index')->with('success', __('Expense deleted successfully.'));
        } catch (\Throwable $e) {
            Log::error('Failed to delete expense', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString(), 'expense_id' => $expense->id]);
            return redirect()->route('expenses.index')->with('error', __('Something went wrong while deleting the expense.'));
        }
    }
}
