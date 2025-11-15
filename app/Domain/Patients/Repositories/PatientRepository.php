<?php

namespace App\Domain\Patients\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Patient;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class PatientRepository
{
    /**
     * Base query for patients.
     */
    public function query()
    {
        return Patient::query()->select('id', 'name', 'email', 'phone', 'birth_date', 'gender', 'marital_status');
    }

    public function getAllPatients(array $filters = []): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "patients.page.{$page}.search." . ($filters['search'] ?? '');

        $store = Cache::getStore();

        $build = function () use ($filters) {
            $query = $this->query();

            if (!empty($filters['search'])) {
                $query->where(function ($q) use ($filters) {
                    $q->where('name', 'like', "%{$filters['search']}%")
                        ->orWhere('email', 'like', "%{$filters['search']}%")
                        ->orWhere('phone', 'like', "%{$filters['search']}%");
                });
            }

            return $query->latest('updated_at')->paginate(10)->withQueryString();
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('patients')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }

    public function createPatient(array $data): Patient
    {
        $patient = Patient::create($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('patients')->flush();
        } else {
            Cache::flush();
        }

        return $patient;
    }

    public function updatePatient(Patient $patient, array $data): bool
    {
        $updated = $patient->update($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('patients')->flush();
        } else {
            Cache::flush();
        }

        return $updated;
    }

    public function deletePatient(Patient $patient): bool
    {
        $deleted = $patient->delete();

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('patients')->flush();
        } else {
            Cache::flush();
        }

        return $deleted;
    }

    public function getPatientDetails(Patient $patient, $toothId = null): array
    {
        $patient->load('teeth');

        $toothWithProcedures = null;
        if ($toothId) {
            $toothWithProcedures = $patient->teeth()
                ->where('id', $toothId)
                ->with('procedures')
                ->first();
        }

        return [
            'patient' => [
                'id' => $patient->id,
                'name' => $patient->name,
                'email' => $patient->email,
                'phone' => $patient->phone,
                'address' => $patient->address,
                'notes' => $patient->notes,
                'birth_date' => $patient->birth_date,
                'gender' => $patient->gender,
                'marital_status' => $patient->marital_status,
                'teeth' => $patient->teeth->map(function ($tooth) {
                    return [
                        'id' => $tooth->id,
                        'tooth_number' => $tooth->tooth_number,
                        'status' => $tooth->status,
                        'notes' => $tooth->notes,
                    ];
                }),
            ],
            'tooth' => $toothWithProcedures
                ? [
                    'id' => $toothWithProcedures->id,
                    'tooth_number' => $toothWithProcedures->tooth_number,
                    'procedures' => $toothWithProcedures->procedures,
                ]
                : null,
        ];
    }
}
