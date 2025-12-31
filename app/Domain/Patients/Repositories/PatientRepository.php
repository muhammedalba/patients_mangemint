<?php

namespace App\Domain\Patients\Repositories;

use App\Domain\Patients\Exceptions\InvalidDiscountException;
use App\Http\Controllers\DashboardController;
use App\Models\Patient;
use App\Models\Procedure;
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
        $cacheKey = 'patients:' . md5(json_encode([
            'page' => $page,
            'filters' => $filters,
        ]));

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
        DashboardController::clearDashboardCache();
        return $patient;
    }

    public function addDiscountToPatient(Patient $patient, float $discountAmount): bool
    {

        $updated = $patient->update([
            'discount_amount' => $discountAmount,
        ]);

        if ($updated) {
            $this->clearCache($patient->id);
            DashboardController::clearDashboardCache();
        }

        return $updated;
    }



    public function updatePatient(Patient $patient, array $data): bool
    {
        $updated = $patient->update($data);
        $this->clearCache($patient->id);

        return $updated;
    }

    public function deletePatient(Patient $patient): bool
    {
        $deleted = $patient->delete();
        $this->clearCache();
        DashboardController::clearDashboardCache();
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
            ])
                ->loadSum('procedures', 'cost')
                ->loadSum('payments', 'amount')
                ->loadCount('procedures');
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('patients')->remember($cacheKey, now()->addMinutes(10), $loadData);
        }
        return Cache::remember($cacheKey, now()->addMinutes(10), $loadData);
    }


    /**
     * Get patient invoice data with caching and eager loading.
     *
     * @param Patient|null $patient The patient model instance.
     * @return Patient The loaded patient model with relations and aggregates.
     * @throws \Exception If patient is not found.
     */
    public function getPatientInvoiceData(?Patient $patient): Patient
    {
        $cacheKey = "patient:{$patient->id}:InvoiceData";
        $store = $this->getCacheStore();

        $cacheTTL = config('cache.patient_invoice_ttl', now()->addMinutes(10));

        $loadData = function () use ($patient) {
            // Eager load relations and calculate aggregates
            return $patient->loadMissing([
                'procedures' => function ($query) {
                    $query->select('procedures.id', 'procedures.tooth_id', 'procedures.cost');
                },
                'payments:id,patient_id,amount,payment_date',
            ])
                ->loadSum('procedures', 'cost')
                ->loadSum('payments', 'amount')
                ->loadCount('procedures');
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('patients')->remember($cacheKey, $cacheTTL, $loadData);
        }

        return Cache::remember($cacheKey, $cacheTTL, $loadData);
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
    private function clearCache($patient = null): void
    {
        $store = $this->getCacheStore();

        if ($store instanceof TaggableStore) {

            $patientsCache = Cache::tags('patients');

            $patient
                ? $patientsCache->forget("patient:{$patient->id}:details")
                : $patientsCache->flush();
        } else {
            Cache::flush();
        }
    }
}
