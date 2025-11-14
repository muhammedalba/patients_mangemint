<?php

namespace App\Domain\Teeth\DTOs;

class ToothData
{
      public function __construct(
            public int $patient_id,
            public string $tooth_number,
            public ?string $status = null,
            public ?string $notes = null
      ) {}

      public static function fromValidated(array $validated): self
      {
            return new self(
                  patient_id: (int) $validated['patient_id'],
                  tooth_number: $validated['tooth_number'],
                  status: $validated['status'] ?? null,
                  notes: $validated['notes'] ?? null,
            );
      }

      public function toArray(): array
      {
            return array_filter([
                  'patient_id' => $this->patient_id,
                  'tooth_number' => $this->tooth_number,
                  'status' => $this->status,
                  'notes' => $this->notes,
            ], fn($v) => $v !== null || $v === 0 || is_int($v));
      }
}
