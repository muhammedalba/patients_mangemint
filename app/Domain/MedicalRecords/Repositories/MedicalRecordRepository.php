<?php

namespace App\Domain\MedicalRecords\Repositories;

use App\Models\MedicalRecord;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class MedicalRecordRepository
{
    /**
     * Base query with relationships.
     */
    public function query()
    {
        return MedicalRecord::with('patient:id,name', 'doctor:id,name')->select('id', 'patient_id', 'doctor_id', 'chief_complaint', 'created_at', 'updated_at');
    }

    public function list(?string $search, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "medical_records.page.{$page}.search.{$search}";

        $store = Cache::getStore();

        $build = function () use ($search, $perPage) {
            $q = $this->query();

            if ($search) {
                $q->where(function ($q2) use ($search) {
                    $q2->where('chief_complaint', 'like', "%{$search}%")
                        ->orWhereHas('patient', fn($q3) => $q3->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('doctor', fn($q3) => $q3->where('name', 'like', "%{$search}%"));
                });
            }

            return $q->latest('updated_at')->paginate($perPage)->withQueryString();
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('medical_records')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }

    public function create(array $data): MedicalRecord
    {
        $record = MedicalRecord::create($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('medical_records')->flush();
        } else {
            Cache::flush();
        }

        return $record;
    }

    public function update(MedicalRecord $medicalRecord, array $data): MedicalRecord
    {
        $medicalRecord->update($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('medical_records')->flush();
        } else {
            Cache::flush();
        }

        return $medicalRecord;
    }

    public function delete(MedicalRecord $medicalRecord): void
    {
        $medicalRecord->delete();

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('medical_records')->flush();
        } else {
            Cache::flush();
        }
    }
}
