<?php

namespace App\Domain\Appointments\Repositories;

use App\Models\Appointment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AppointmentRepository
{
    public function create(array $data): Appointment
    {
        return Appointment::create($data);
    }

    public function update(Appointment $appointment, array $data): Appointment
    {
        $appointment->update($data);
        return $appointment;
    }

    public function delete(Appointment $appointment): void
    {
        $appointment->delete();
    }

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        return Appointment::with(['patient:id,name', 'doctor:id,name', 'procedure:id,name'])
            ->when($search, function ($query, $search) {
                // Add search logic if needed in the future
            })
            ->latest('created_at')
            ->paginate($perPage);
    }
}
