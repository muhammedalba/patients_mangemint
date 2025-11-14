<?php

namespace App\Domain\Payments\DTOs;

class PaymentData
{
    public function __construct(
        public int $patient_id,
        public float $amount,
        public string $payment_date,
        public ?string $paid_at,
        public ?string $notes

    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['invoice_id'],
            $data['amount'],
            $data['paid_at']?? null,
            $data['payment_date'],
            $data['notes'] ?? null

        );
    }

    public function toArray(): array
    {
        return [
            'patient_id' => $this->patient_id,
            'amount' => $this->amount,
            'payment_date' => $this->payment_date,
            'paid_at' => $this->paid_at,
            'notes' => $this->notes
        ];
    }
}
