<?php

namespace App\Domain\Expenses\DTOs;

class ExpenseData
{
    public function __construct(
        public float $amount,
        public ?string $description,
        public int $expense_category_id,
        public ?string $payment_method,
        public string $expense_date
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['amount'],
            $data['description'] ?? null,
            $data['expense_category_id'],
            $data['payment_method'] ?? 'other',
            $data['expense_date'],
        );
    }

    public function toArray(): array
    {
        return [
            'amount' => $this->amount,
            'description' => $this->description,
            'expense_category_id' => $this->expense_category_id,
            'payment_method' => $this->payment_method,
            'expense_date' => $this->expense_date,
        ];
    }
}
