<?php

namespace App\Domain\Appointments\Services;

use App\Domain\Appointments\DTOs\AppointmentData;
use App\Domain\Appointments\Repositories\AppointmentRepository;
use App\Models\Appointment;
use Illuminate\Support\Facades\Log;

class AppointmentService
{
    public function __construct(private AppointmentRepository $repo) {}

    public function listAppointments(?string $search = null, int $perPage = 10)
    {
        return $this->repo->list($search, $perPage);
    }

    public function create(AppointmentData $data): Appointment
    {
        try {
            return $this->repo->create($data->toArray());
        } catch (\Throwable $e) {
            Log::error('Appointment creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data'  => $data->toArray(),
            ]);
            throw $e;
        }
    }

    public function update(Appointment $appointment, AppointmentData $data): Appointment
    {
        try {
            return $this->repo->update($appointment, $data->toArray());
        } catch (\Throwable $e) {
            Log::error('Appointment update failed', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data->toArray(),
            ]);
            throw $e;
        }
    }

    public function delete(Appointment $appointment): void
    {
        $this->repo->delete($appointment);
    }
}
