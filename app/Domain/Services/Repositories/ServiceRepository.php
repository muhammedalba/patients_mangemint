<?php

namespace App\Domain\Services\Repositories;

use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class ServiceRepository
{
    public function create(array $data): Service
    {
        Cache::flush();
        return Service::create($data);
    }

    public function update(Service $service, array $data): Service
    {
        Cache::flush();
        $service->update($data);
        return $service;
    }

    public function delete(Service $service): void
    {
        Cache::flush();
        $service->delete();
    }

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "services.page.{$page}.search.{$search}";

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($search, $perPage) {
            $paginator = Service::with('category')
                ->select(['id', 'name', 'description', 'price', 'category_id'])
                ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
                ->orderByDesc('updated_at')
                ->paginate($perPage)
                ->withQueryString();

            // map the items to include category name
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
        });
    }
}
