<?php

namespace App\Domain\ServiceCategories\Repositories;

use App\Models\ServiceCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class ServiceCategoryRepository
{
    public function create(array $data): ServiceCategory
    {
        Cache::flush();
        return ServiceCategory::create($data);
    }

    public function update(ServiceCategory $category, array $data): ServiceCategory
    {
        Cache::flush();
        $category->update($data);
        return $category;
    }

    public function delete(ServiceCategory $category): void
    {
        Cache::flush();
        $category->delete();
    }

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "service_categories.page.{$page}.search.{$search}";

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($search, $perPage) {
            return ServiceCategory::query()
                ->select(['id', 'name', 'description'])
                ->when(
                    $search,
                    fn($q) => $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                )
                ->orderByDesc('updated_at')
                ->paginate($perPage)
                ->withQueryString();
        });
    }
}
