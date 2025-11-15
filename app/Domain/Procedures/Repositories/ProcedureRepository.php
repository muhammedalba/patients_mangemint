<?php

namespace App\Domain\Procedures\Repositories;

use App\Models\Procedure;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class ProcedureRepository
{
    public function create(array $data): Procedure
    {
        Cache::flush();
        return Procedure::create($data);
    }

    public function update(Procedure $procedure, array $data): Procedure
    {
        Cache::flush();
        $procedure->update($data);
        return $procedure;
    }

    public function delete(Procedure $procedure): void
    {
        Cache::flush();
        $procedure->delete();
    }

    public function find(int $id): ?Procedure
    {
        return Procedure::with(['tooth.patient'])->find($id);
    }

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "procedures.page.{$page}.search.{$search}";

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($search, $perPage) {
            return Procedure::query()
                ->with(['tooth:id,tooth_number,patient_id', 'tooth.patient:id,name'])
                ->select(['id', 'name', 'description', 'cost', 'tooth_id'])
                ->when(
                    $search,
                    fn($q) => $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('tooth.patient', fn($q) => $q->where('name', 'like', "%{$search}%"))
                )
                ->latest('updated_at')
                ->paginate($perPage)
                ->withQueryString();
        });
    }
}
