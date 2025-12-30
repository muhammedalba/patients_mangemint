<?php

namespace App\Domain\ExpenseAudits\DTOs;

class ExpenseAuditData
{
    public function __construct(
        public int $expense_id,
        public float $old_amount,
        public float $new_amount,
        public ?int $changed_by,
        public ?string $reason,
        public ?string $changed_at
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            (int) $data['expense_id'],
            (float) ($data['old_amount'] ?? 0),
            (float) ($data['new_amount'] ?? 0),
            isset($data['changed_by']) ? (int) $data['changed_by'] : null,
            $data['reason'] ?? null,
            $data['changed_at'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'expense_id' => $this->expense_id,
            'old_amount' => $this->old_amount,
            'new_amount' => $this->new_amount,
            'changed_by' => $this->changed_by,
            'reason' => $this->reason,
            'changed_at' => $this->changed_at,
        ];
    }
}
