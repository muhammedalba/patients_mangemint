<?php

namespace App\Domain\Patients\Services;

use App\Domain\Patients\DTOs\PatientData;
use App\Domain\Patients\Repositories\PatientRepository;
use \Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Patient;

class PatientService
{
    public function __construct(private PatientRepository $repository) {}

    public function getAllPatients(array $filters = []): LengthAwarePaginator
    {
        return $this->repository->getAllPatients($filters);
    }

    public function createPatient(PatientData $data): Patient
    {
        return $this->repository->createPatient($data->toArray());
    }

    public function updatePatient(Patient $patient, PatientData $data): bool
    {
        return $this->repository->updatePatient($patient, $data->toArray());
    }

    public function deletePatient(Patient $patient): bool
    {
        return $this->repository->deletePatient($patient);
    }

    public function getPatientDetails(Patient $patient, $toothId = null): array
    {
        $this->repository->getPatientDetails($patient);
          // حساب التكلفة الإجمالية للإجراءات
        $totalProceduresCost = $patient->procedures->sum('cost');

        // حساب جميع الدفعات
        $totalPayments = $patient->payments->sum('amount');

        // حساب المتبقي
        $remainingBalance = $totalProceduresCost - $totalPayments;

        // إرجاع بيانات سن محدد (إن وُجد)
        // $toothWithProcedures = null;
        // if ($toothId) {
        //     $toothWithProcedures = $patient->teeth()
        //         ->where('id', $toothId)
        //         ->with('procedures')
        //         ->first();
        // }
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

                'teeth' => $patient->teeth,
                'payments' => $patient->payments,
                'appointments' => $patient->appointments,
                'procedures' => $patient->procedures,
                'medical_record' => $patient->medicalRecord,

                // البيانات المالية المحسوبة
                'financial_summary' => [
                    'total_procedures_cost' => $totalProceduresCost,
                    'total_payments' => $totalPayments,
                    'remaining_balance' => $remainingBalance,
                ],
            ],

            // 'tooth' => $toothWithProcedures
            //     ? [
            //         'id' => $toothWithProcedures->id,
            //         'tooth_number' => $toothWithProcedures->tooth_number,
            //         'procedures' => $toothWithProcedures->procedures,
            //     ]
            //     : null,
        ];

    }
    // get Tooth Procedures
    public function getToothProcedures(Patient $patient, $toothId): array
    {
        return $this->repository->getToothProcedures($patient, $toothId);
    }
}
