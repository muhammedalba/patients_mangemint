<?php
namespace App\Domain\Services\Repositories;

use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class ServiceRepository
{
    private function getCacheStore()
    {
        return Cache::getStore();
    }

    public function create(array $data): Service
    {
        $service = Service::create($data);
        $this->clearCache();
        return $service;
    }

    public function update(Service $service, array $data): Service
    {
        $service->update($data);
        $this->clearCache();
        return $service;
    }

    public function delete(Service $service): void
    {
        $service->delete();
        $this->clearCache();
    }

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "services.page.{$page}.search.{$search}";
        $store = $this->getCacheStore();

        $build = function () use ($search, $perPage) {
            $paginator = Service::with('category')
                ->select(['id', 'name', 'description', 'price', 'category_id'])
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('category', fn($q2) => $q2->where('name', 'like', "%{$search}%")))
                ->latest('updated_at')
                ->paginate($perPage)
                ->withQueryString();

            $paginator->getCollection()->transform(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'price' => $service->price,
                    'category' => $service->category?->name,
                ];
            });

            return $paginator;
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('services')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }

    private function clearCache(): void
    {
        $store = $this->getCacheStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('services')->flush();
        } else {
            Cache::flush();
        }
    }
}

