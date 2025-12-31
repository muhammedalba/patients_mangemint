<?php

namespace App\Domain\Patients\Services;

use App\Domain\Patients\DTOs\PatientData;
use App\Domain\Patients\Exceptions\InvalidDiscountException;
use App\Domain\Patients\Repositories\PatientRepository;
use \Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Patient;
use App\Models\Procedure;

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

    public function getPatientDetails(Patient $patient): array
    {
        $data = $this->repository->getPatientDetails($patient);
        // calculate financial summary

        $totalProceduresCost = $data->procedures_sum_cost ?? 0;
        $totalPayments       = $data->payments_sum_amount ?? 0;
        $totalProcedures     = $data->procedures_count ?? 0;
        //get discount amount
        $discountAmount = $data->discount_amount ?? 0;
        // calculate total after discount
        $totalAfterDiscount = max(
            $totalProceduresCost - $discountAmount,
            0
        );
        // calculate remaining balance
        $remainingBalance = $totalAfterDiscount - $totalPayments;
        //  @dd($patient->procedures);
        return [
            'id' => $patient->id,
            'name' => $patient->name,
            'email' => $patient->email,
            'phone' => $patient->phone,
            'address' => $patient->address,
            'notes' => $patient->notes,
            'birth_date' => $patient->birth_date,
            'gender' => $patient->gender,
            'marital_status' => $patient->marital_status,

            // related data
            'teeth' => $patient->teeth,
            'payments' => $patient->payments,
            'appointments' => $patient->appointments,
            'procedures' => $patient->procedures,
            'medical_record' => $patient->medicalRecord,

            //  financial summary
            'financial_summary' => [
                'total_procedures' => $totalProcedures,
                'total_procedures_cost' => $totalProceduresCost,
                'discount_amount' => $discountAmount,
                'total_procedures_after_discount' => $totalAfterDiscount,
                'total_payments' => $totalPayments,
                'remaining_balance' => $remainingBalance,
            ],



        ];
    }


    // get Tooth Procedures
    public function getToothProcedures(Patient $patient, $toothId): array
    {
        return $this->repository->getToothProcedures($patient, $toothId);
    }

    public function addDiscountToPatient(Patient $patient, float $discountAmount)
    {
        if ($discountAmount <= 0) {
            throw new InvalidDiscountException($discountAmount, 0, __("Discount amount cannot be negative."));
        }
        // check if discount amount is greater than total procedures cost
        $proceduresTotalCost = $patient->procedures_sum_cost
            ?? Procedure::where('patient_id', $patient->id)->sum('cost');

        if ($discountAmount > $proceduresTotalCost) {
            throw new InvalidDiscountException(
                $discountAmount,
                $proceduresTotalCost
            );
        }

        return  $this->repository->addDiscountToPatient($patient, $discountAmount);
    }
}
