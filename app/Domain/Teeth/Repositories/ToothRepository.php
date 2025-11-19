<?php
namespace App\Domain\Teeth\Repositories;

use App\Models\Tooth;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class ToothRepository
{
    private function getCacheStore()
    {
        return Cache::getStore();
    }

    public function create(array $data): Tooth
    {
        $tooth = Tooth::create($data);
        $this->clearCache();
        return $tooth;
    }

    public function update(Tooth $tooth, array $data): Tooth
    {
        $tooth->update($data);
        $this->clearCache();
        return $tooth;
    }

    public function delete(Tooth $tooth): void
    {
        $tooth->delete();
        $this->clearCache();
    }

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "teeth.page.{$page}.search.{$search}";
        $store = $this->getCacheStore();

        $build = function () use ($search, $perPage) {
            return Tooth::with(['patient:id,name'])
                ->select('id', 'tooth_number', 'status', 'notes', 'patient_id')
                ->when($search, function ($query) use ($search) {
                    $query->where('tooth_number', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhereHas('patient', fn($q) => $q->where('name', 'like', "%{$search}%"));
                })
                ->latest('updated_at')
                ->paginate($perPage)
                ->withQueryString();
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('teeth')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }

    private function clearCache(): void
    {
        $store = $this->getCacheStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('teeth')->flush();
        } else {
            Cache::flush();
        }
    }
}

