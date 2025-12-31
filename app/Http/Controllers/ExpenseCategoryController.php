<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\ExpenseCategory;
use App\Domain\ExpenseCategories\Services\ExpenseCategoryService;
use App\Domain\ExpenseCategories\DTOs\ExpenseCategoryData;
use Illuminate\Http\Request;
use App\Http\Requests\ExpenseCategoryStoreRequest;
use App\Http\Requests\ExpenseCategoryUpdateRequest;

class ExpenseCategoryController extends Controller
{
    public function __construct(private ExpenseCategoryService $service) {}

    public function index(Request $request)
    {
        try {
            $search = $request->query('search');
            $categories = $this->service->list($search);

            return Inertia::render('ExpenseCategories/Index', [
                'categories' => $categories,
                'filters' => ['search' => $search],
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to load expense categories index page', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return redirect()
                ->back()
                ->with('error', __('Failed to load expense categories index page'));
        }
    }

    public function create()
    {
        return Inertia::render('ExpenseCategories/Create');
    }

    public function store(ExpenseCategoryStoreRequest $request)
    {

        $data = ExpenseCategoryData::fromArray($request->all());
        $this->service->createCategory($data);

        return redirect()->route('expense-categories.index')->with('success', __('Category created successfully.'));
    }

    public function edit(ExpenseCategory $expenseCategory)
    {
        return Inertia::render('ExpenseCategories/Edit', [
            'category' => $expenseCategory,
        ]);
    }

    public function update(ExpenseCategoryUpdateRequest $request, ExpenseCategory $expenseCategory)
    {

        $data = ExpenseCategoryData::fromArray($request->all());
        $this->service->updateCategory($expenseCategory, $data);

        return redirect()->route('expense-categories.index')->with('success', __('Category updated successfully.'));
    }

    public function destroy(ExpenseCategory $expenseCategory)
    {

        $this->service->deleteCategory($expenseCategory);

        return redirect()->route('expense-categories.index')->with('success', __('Category deleted successfully.'));
    }
}
