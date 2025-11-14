<?php

namespace App\Domain\Teeth\Repositories;

use App\Models\Tooth;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class ToothRepository
{
    public function create(array $data): Tooth
    {
        Cache::flush();
        return Tooth::create($data);
    }

    public function update(Tooth $tooth, array $data): Tooth
    {
        Cache::flush();
        $tooth->update($data);
        return $tooth;
    }

    public function delete(Tooth $tooth): void
    {
        Cache::flush();
        $tooth->delete();
    }

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "teeth.page.{$page}.search.{$search}";

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($search, $perPage) {
            $paginator = Tooth::with(['patient:id,name'])->select('id', 'tooth_number', 'status', 'notes', 'patient_id')
                ->when($search, function ($query, $search) {
                    $query->where('tooth_number', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%")
                        ->orWhereHas('patient', fn($q) => $q->where('name', 'like', "%{$search}%"))
                    ;
                })
                ->orderByDesc('updated_at')
                ->paginate($perPage)
                ->withQueryString();
            return $paginator;
        });
    }
}
