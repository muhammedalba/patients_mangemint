<?php
namespace App\Domain\ServiceCategories\Repositories;

use App\Models\ServiceCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class ServiceCategoryRepository
{
    private function getCacheStore()
    {
        return Cache::getStore();
    }

    public function create(array $data): ServiceCategory
    {
        $category = ServiceCategory::create($data);
        $this->clearCache();
        return $category;
    }

    public function update(ServiceCategory $category, array $data): ServiceCategory
    {
        $category->update($data);
        $this->clearCache();
        return $category;
    }

    public function delete(ServiceCategory $category): void
    {
        $category->delete();
        $this->clearCache();
    }

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "service_categories.page.{$page}.search.{$search}";
        $store = $this->getCacheStore();

        $build = function () use ($search, $perPage) {
            return ServiceCategory::query()
                ->select(['id', 'name', 'description'])
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%"))
                ->latest('updated_at')
                ->paginate($perPage)
                ->withQueryString();
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('service_categories')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }

    private function clearCache(): void
    {
        $store = $this->getCacheStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('service_categories')->flush();
        } else {
            Cache::flush();
        }
    }
}


