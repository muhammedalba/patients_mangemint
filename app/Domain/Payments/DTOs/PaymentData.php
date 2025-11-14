<?php

namespace App\Domain\Payments\DTOs;

class PaymentData
{
    public function __construct(
        public int $patient_id,
        public float $amount,
        public string $payment_date,
        public ?string $notes

    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['patient_id'],
            $data['amount'],
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
            'notes' => $this->notes
        ];
    }
}
