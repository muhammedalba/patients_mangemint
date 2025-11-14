<?php

namespace App\Domain\Payments\Services;

use App\Domain\Payments\DTOs\PaymentData;
use App\Domain\Payments\Repositories\PaymentRepository;
use App\Models\Payment;
use \Illuminate\Contracts\Pagination\LengthAwarePaginator;
class PaymentService
{
      public function __construct(private PaymentRepository $repository) {}

      public function getAllPayments(array $filters = []):LengthAwarePaginator
      {
            return $this->repository->getAllPayments($filters);
      }

      public function createPayment(PaymentData $data): Payment
      {
            return $this->repository->createPayment($data->toArray());
      }

      public function updatePayment(Payment $payment, PaymentData $data): bool
      {
            return $this->repository->updatePayment($payment, $data->toArray());
      }

      public function deletePayment(Payment $payment): bool
      {
            return $this->repository->deletePayment($payment);
      }
}
