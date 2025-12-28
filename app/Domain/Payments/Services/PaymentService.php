<?php

namespace App\Domain\Payments\Services;

use App\Domain\Payments\DTOs\PaymentData;
use App\Domain\Payments\Repositories\PaymentRepository;
use App\Models\Payment;
use \Illuminate\Contracts\Pagination\LengthAwarePaginator;


class PaymentService
{
    public function __construct(private PatientBalanceService $balanceService, private PaymentRepository $repository) {}

    public function getAllPayments(array $filters = []): LengthAwarePaginator
    {
        return $this->repository->getAllPayments($filters);
    }

    public function createPayment(PaymentData $data): Payment
    {
        // validate payment does not exceed patient's balance
        $this->balanceService->validatePayment($data->patient_id, $data->amount);

        return $this->repository->createPayment($data->toArray());
    }


    public function updatePayment(Payment $payment, PaymentData $data): bool
    {
        // validate payment does not exceed patient's balance
        $this->balanceService->validatePayment($data->patient_id, $data->amount);
        return $this->repository->updatePayment($payment, $data->toArray());
    }

    public function deletePayment(Payment $payment): bool
    {
        return $this->repository->deletePayment($payment);
    }
}
