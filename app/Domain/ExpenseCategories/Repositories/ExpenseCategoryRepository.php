<?php

namespace App\Domain\ExpenseCategories\Repositories;

use App\Models\ExpenseCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class ExpenseCategoryRepository
{
      public function query()
      {
            return ExpenseCategory::query()->select('id', 'name', 'type');
      }

      public function list(?string $search = null, int $perPage = 15): LengthAwarePaginator
      {
            $page = request('page', 1);
            $cacheKey = "expense_categories.page.{$page}.search." . ($search ?? '');

            $store = Cache::getStore();

            $build = function () use ($search, $perPage) {
                  $q = $this->query();

                  if ($search) {
                        $q->where('name', 'like', "%{$search}%");
                  }

                  return $q->latest('updated_at')->paginate($perPage)->withQueryString();
            };

            if ($store instanceof TaggableStore) {
                  return Cache::tags('expense_categories')->remember($cacheKey, now()->addMinutes(10), $build);
            }

            return Cache::remember($cacheKey, now()->addMinutes(10), $build);
      }

      public function create(array $data): ExpenseCategory
      {
            $category = ExpenseCategory::create($data);

            $store = Cache::getStore();
            if ($store instanceof TaggableStore) {
                  Cache::tags('expense_categories')->flush();
            } else {
                  Cache::flush();
            }

            return $category;
      }

      public function update(ExpenseCategory $category, array $data): bool
      {
            $updated = $category->update($data);

            $store = Cache::getStore();
            if ($store instanceof TaggableStore) {
                  Cache::tags('expense_categories')->flush();
            } else {
                  Cache::flush();
            }

            return $updated;
      }

      public function delete(ExpenseCategory $category): bool
      {
            $deleted = $category->delete();

            $store = Cache::getStore();
            if ($store instanceof TaggableStore) {
                  Cache::tags('expense_categories')->flush();
            } else {
                  Cache::flush();
            }

            return $deleted;
      }
}
