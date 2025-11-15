<?php

namespace App\Domain\Appointments\DTOs;

class AppointmentData
{
    public function __construct(
        public int $patient_id,
        public ?int $user_id,
        public int $service_id,
        public string $appointment_date,
        public array $times,
        public ?string $notes,
        public string $status
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            patient_id: $validated['patient_id'],
            user_id: $validated['user_id'],
            service_id: $validated['service_id'],
            appointment_date: $validated['appointment_date'],
            times: $validated['times'],
            notes: $validated['notes'] ?? null,
            status: $validated['status']
        );
    }

    public function toArray(): array
    {
        return [
            'patient_id' => $this->patient_id,
            'user_id' => $this->user_id,
            'service_id' => $this->service_id,
            'appointment_date' => $this->appointment_date,
            'times' => $this->times,
            'notes' => $this->notes,
            'status' => $this->status,
        ];
    }
}
