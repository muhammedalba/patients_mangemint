<?php

namespace App\Domain\Procedures\Repositories;

use App\Models\Procedure;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class ProcedureRepository
{
    private function getCacheStore()
    {
        return Cache::getStore();
    }

    public function create(array $data): Procedure
    {
        $procedure = Procedure::create($data);
        $this->clearCache();
        return $procedure;
    }

    public function update(Procedure $procedure, array $data): Procedure
    {
        $procedure->update($data);
        $this->clearCache();
        return $procedure;
    }

    public function delete(Procedure $procedure): void
    {
        $procedure->delete();
        $this->clearCache();
    }

    public function find(int $id): ?Procedure
    {
        return Procedure::with(['patient'])->find($id);
    }

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "procedures.page.{$page}.search.{$search}";
        $store = $this->getCacheStore();

        $build = function () use ($search, $perPage) {
            return Procedure::with(['patient:id,name', 'tooth:id,tooth_number'])

                ->when($search, function ($q) use ($search) {
                    $q->where(function ($q) use ($search) {
                        $q->where('procedures.name', 'like', "%{$search}%")
                            ->orWhere('procedures.description', 'like', "%{$search}%")
                            ->orWhereHas('patient', function ($q2) use ($search) {
                                $q2->where('name', 'like', "%{$search}%");
                            });
                    });
                })
                ->latest('updated_at')
                ->paginate($perPage)
                ->withQueryString();
        };


        if ($store instanceof TaggableStore) {
            return Cache::tags('procedures')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }

    private function clearCache(): void
    {
        $store = $this->getCacheStore();
        if ($store instanceof TaggableStore) {
            Cache::tags(['procedures', 'patients'])->flush();
        } else {
            // If the user's cache driver doesn't support tags (like file), 
            // we must flush everything to ensure synchronization.
            Cache::flush();
        }
    }
}
