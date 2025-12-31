<?php

namespace App\Domain\Appointments\DTOs;

final class AppointmentData
{
    public function __construct(
        public int $patient_id,
        public int $user_id,
        public ?int $service_id,
        public string $date,           // 'YYYY-MM-DD'
        public string $start_time,     // 'HH:MM' or 'HH:MM:SS'
        public int $duration_slots,    // e.g. 1,2,3
        public ?string $notes = null,
        public string $status = 'scheduled'
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            patient_id: (int) $validated['patient_id'],
            user_id: (int) $validated['user_id'],
            service_id: isset($validated['service_id']) && $validated['service_id'] !== ''
                ? (int) $validated['service_id']
                : null,

            date: $validated['date'],
            start_time: $validated['start_time'],
            duration_slots: (int) ($validated['duration_slots'] ?? 1),
            notes: $validated['notes'] ?? null,
            status: $validated['status'] ?? 'scheduled'
        );
    }

    public function toArray(): array
    {
        return [
            'patient_id' => $this->patient_id,
            'user_id' => $this->user_id,
            'service_id' => $this->service_id,
            'date' => $this->date,
            'start_time' => $this->start_time,
            'duration_slots' => $this->duration_slots,
            'notes' => $this->notes,
            'status' => $this->status,
        ];
    }
}
