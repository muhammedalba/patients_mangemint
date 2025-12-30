<?php

namespace App\Domain\Payments\Services;

use App\Models\Patient;
use App\Models\Payment;
use App\Models\Procedure;

class PatientBalanceService
{
    public function getRemainingBalance(int $patientId): float
    {
        // 1) get patient details
        $patient = Patient::findOrFail($patientId);

        // 2) get total procedures cost
        $totalProcedures = Procedure::where('patient_id', $patientId)
            ->whereIn('status', ['completed', 'in_progress'])
            ->sum('cost');

        // 3) get total payments made
        $totalPayments = Payment::where('patient_id', $patientId)
            ->sum('amount');

        // 4) apply discount if any
        $discount = $patient->discount_amount ?? 0;
        // @dd($discount);
        return max(
            ($totalProcedures - $discount) - $totalPayments,
            0
        );
    }

    public function validatePayment(int $patientId, float $amount): void
    {
        $remaining = $this->getRemainingBalance($patientId);

        if ($remaining <= 0) {
            throw new \DomainException('Patient has no outstanding balance.');
        }

        if ($amount > $remaining) {
            throw new \DomainException(
                'Payment amount exceeds the outstanding balance.'
            );
        }
    }
}
