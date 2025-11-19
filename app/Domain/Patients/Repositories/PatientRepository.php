<?php

namespace App\Domain\Patients\Repositories;

use App\Http\Controllers\DashboardController;
use App\Models\Patient;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class PatientRepository
{
    private function getCacheStore()
    {
        return Cache::getStore();
    }

    public function query()
    {
        return Patient::query()->select('id', 'name', 'email', 'phone', 'birth_date', 'gender', 'marital_status');
    }

    public function getAllPatients(array $filters = []): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "patients.page.{$page}.search." . ($filters['search'] ?? '');
        $store = $this->getCacheStore();

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
        $this->clearCache();
        return $patient;
    }

    public function updatePatient(Patient $patient, array $data): bool
    {
        $updated = $patient->update($data);
        $this->clearCache();
        return $updated;
    }

    public function deletePatient(Patient $patient): bool
    {
        $deleted = $patient->delete();
        $this->clearCache();
        return $deleted;
    }

    public function getPatientDetails(Patient $patient)
    {
        $cacheKey = "patient:{$patient->id}:details";
        $store = $this->getCacheStore();

        $loadData = function () use ($patient) {
            return $patient->load([
                'procedures' => function ($query) {
                    $query->select('procedures.id', 'procedures.tooth_id', 'procedures.cost');
                },
                'payments:id,patient_id,amount,payment_date',
                'appointments:id,patient_id,status,start_time,end_time,date,notes',
                'medicalRecord:id,patient_id',
                "teeth:id,patient_id,tooth_number,status,notes"
            ]);
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('patients')->remember($cacheKey, now()->addMinutes(10), $loadData);
        }
        return Cache::remember($cacheKey, now()->addMinutes(10), $loadData);
    }

    public function getToothProcedures(Patient $patient, $toothId)
    {
        $cacheKey = "tooth:{$patient->id}:{$toothId}:procedures";
        $store = $this->getCacheStore();

        $loadData = function () use ($patient, $toothId) {
            return $patient->teeth()
                ->where('teeth.id', $toothId)
                ->select('teeth.id', 'teeth.tooth_number')
                ->with(['procedures:id,name,description,cost,tooth_id,duration_minutes,follow_up_days'])
                ->first();
        };

        if ($store instanceof TaggableStore) {
            $data = Cache::tags('patients')->remember($cacheKey, now()->addMinutes(10), $loadData);
        } else {
            $data = Cache::remember($cacheKey, now()->addMinutes(10), $loadData);
        }

        return ['ToothProcedures' => $data];
    }

    private function clearCache(): void
    {
        $store = $this->getCacheStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('patients')->flush();
        } else {
            Cache::flush();
        }
        DashboardController::clearDashboardCache();

    }
}
