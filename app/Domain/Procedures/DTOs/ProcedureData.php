<?php

namespace App\Domain\Procedures\DTOs;

class ProcedureData
{
    public function __construct(
        public string $name,
        public ?string $description = null,
        public float $cost = 0.0,
        public int $duration_minutes = 0,
        public int $tooth_id = 0,
        public ?int $patient_id = null,
        public ?int $follow_up_days = null
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            name: $validated['name'],
            description: $validated['description'] ?? null,
            cost: isset($validated['cost']) ? (float) $validated['cost'] : 0.0,
            duration_minutes: (int) ($validated['duration_minutes'] ?? 0),
            tooth_id: (int) ($validated['tooth_id'] ?? 0),
            patient_id: isset($validated['patient_id']) ? (int) $validated['patient_id'] : null,
            follow_up_days: isset($validated['follow_up_days']) ? (int) $validated['follow_up_days'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'cost' => $this->cost,
            'duration_minutes' => $this->duration_minutes,
            'tooth_id' => $this->tooth_id,
            'patient_id' => $this->patient_id,
            'follow_up_days' => $this->follow_up_days,
        ];
    }
}
