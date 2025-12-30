<?php

namespace App\Domain\Procedures\DTOs;

use Carbon\CarbonImmutable;

class ProcedureData
{
    public function __construct(
        public string $name,
        public string $status,
        public ?string $description = null,
        public float $cost = 0.0,

        public int $duration_minutes = 0,
        public CarbonImmutable $processing_date,
        public ?int $tooth_id = null,
        public int $patient_id,
        public ?int $follow_up_days = null
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            name: $validated['name'],
            description: $validated['description'] ?? null,
            status: $validated['status'],
            processing_date: isset($validated['processing_date'])
                ? CarbonImmutable::parse($validated['processing_date'])
                : CarbonImmutable::now(),
            cost: isset($validated['cost']) ? (float) $validated['cost'] : 0.0,
            duration_minutes: (int) ($validated['duration_minutes'] ?? 0),
            tooth_id: isset($validated['tooth_id']) ? (int) $validated['tooth_id'] : null,
            patient_id: (int) $validated['patient_id'],
            follow_up_days: isset($validated['follow_up_days']) ? (int) $validated['follow_up_days'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'cost' => $this->cost,
            'duration_minutes' => $this->duration_minutes,
            'processing_date' => $this->processing_date->toDateTimeString(),
            'tooth_id' => $this->tooth_id,
            'patient_id' => $this->patient_id,
            'follow_up_days' => $this->follow_up_days,
        ];
    }
}
