<?php

namespace App\Domain\Patients\Services;

use App\Domain\Exceptions\DomainRuleException;
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
        if (!$patient) {
            throw new DomainRuleException('error', 'Patient not found', true);
        }
        $PatientDetails = $this->repository->getPatientDetails($patient);
        // calculate financial summary
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
            'financial_summary' => $this->calculatePatientFinancialSummary($PatientDetails),
        ];
    }


    // get patient invoice data
    public function getPatientInvoiceData(Patient $patient): array
    {
        if (!$patient) {
            throw new DomainRuleException('error', 'Patient not found', true);
        }

        // $patient->load(['payments', 'procedures']);
        $invoiceData = $this->repository->getPatientInvoiceData($patient);

        // prepare patient data
        $patientData = [
            'id' => $patient->id,
            'name' => $patient->name ?? 'N/A',
            'email' => $patient->email ?? 'N/A',
            'phone' => $patient->phone ?? 'N/A',
            'address' => $patient->address ?? 'N/A',
            'notes' => $patient->notes ?? 'N/A',
            'birth_date' => $patient->birth_date ?? null,
            'gender' => $patient->gender ?? 'N/A',
            'marital_status' => $patient->marital_status ?? 'N/A',
        ];

        // prepare related data
        $relatedData = [
            'payments' => $patient->payments ?? collect(),
            'procedures' => $patient->procedures ?? collect(),
        ];

        // calculate financial summary
        $financialSummary = $this->calculatePatientFinancialSummary($invoiceData);

        // merge all data
        return array_merge($patientData, $relatedData, ['financial_summary' => $financialSummary]);

    }
    // get Tooth Procedures
    public function getToothProcedures(Patient $patient, $toothId): array
    {
        return $this->repository->getToothProcedures($patient, $toothId);
    }

    public function addDiscountToPatient(Patient $patient, float $discountAmount)
    {
        // check if discount amount is valid
        if ($discountAmount < 0 || $discountAmount == 0) {
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
    // calculate patient invoice data
    public function calculatePatientFinancialSummary(Patient $patient): array
    {
        // calculate financial summary

        $totalProceduresCost = $patient->procedures_sum_cost ?? 0;
        $totalPayments       = $patient->payments_sum_amount ?? 0;
        $totalProcedures     = $patient->procedures_count ?? 0;
        //get discount amount
        $discountAmount = $patient->discount_amount ?? 0;
        // calculate total after discount
        $totalAfterDiscount = max(
            $totalProceduresCost - $discountAmount,
            0
        );
        // calculate remaining balance
        $remainingBalance = $totalAfterDiscount - $totalPayments;
        //  @dd($patient->procedures);
        if ($remainingBalance <= 0) {
            $discountAmount = 0;
            $remainingBalance = 0;
            $totalAfterDiscount = $totalProceduresCost;
        }
        return [
            'total_procedures' => $totalProcedures,
            'total_procedures_cost' => $totalProceduresCost,
            'discount_amount' => $discountAmount,
            'total_procedures_after_discount' => $totalAfterDiscount,
            'total_payments' => $totalPayments,
            'remaining_balance' => $remainingBalance,
        ];
    }
}
