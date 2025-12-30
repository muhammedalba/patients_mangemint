<?php

namespace App\Domain\ExpenseCategories\Services;

use App\Domain\ExpenseCategories\DTOs\ExpenseCategoryData;
use App\Domain\ExpenseCategories\Repositories\ExpenseCategoryRepository;
use App\Models\ExpenseCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ExpenseCategoryService
{
      public function __construct(private ExpenseCategoryRepository $repository) {}

      public function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
      {
            return $this->repository->list($search, $perPage);
      }

      public function createCategory(ExpenseCategoryData $data): ExpenseCategory
      {
            return $this->repository->create($data->toArray());
      }

      public function updateCategory(ExpenseCategory $category, ExpenseCategoryData $data): bool
      {
            return $this->repository->update($category, $data->toArray());
      }

      public function deleteCategory(ExpenseCategory $category): bool
      {
            return $this->repository->delete($category);
      }
}
