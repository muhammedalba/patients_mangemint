<?php

namespace App\Http\Controllers;


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

        $data = ExpenseData::fromArray($request->validated());

        $this->service->createExpense($data);

        return redirect()->route('expenses.index')->with('success', __('Expense created successfully.'));
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
        // @dd($request->validated());
        $data = ExpenseData::fromArray($request->validated());
        // @dd($data);
        $this->service->updateExpense($expense, $data);

        return redirect()->route('expenses.index')->with('success', __('Expense updated successfully.'));
    }

    public function destroy(Expense $expense)
    {

        $this->service->deleteExpense($expense);

        return redirect()->route('expenses.index')->with('success', __('Expense deleted successfully.'));
    }
}
