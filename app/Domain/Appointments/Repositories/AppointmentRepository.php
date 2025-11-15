<?php

namespace App\Domain\Appointments\Repositories;

use App\Models\Appointment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class AppointmentRepository
{
    /**
     * Base query with relationships.
     */
    public function query()
    {
        return Appointment::with(['patient:id,name', 'doctor:id,name', 'service:id,name'])->select('id', 'patient_id', 'user_id', 'service_id', 'appointment_date', 'times', 'status');
    }

    public function create(array $data): Appointment
    {
        $appointment = Appointment::create($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('appointments')->flush();
        } else {
            Cache::flush();
        }

        return $appointment;
    }

    public function update(Appointment $appointment, array $data): Appointment
    {
        $appointment->update($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('appointments')->flush();
        } else {
            Cache::flush();
        }

        return $appointment;
    }

    public function delete(Appointment $appointment): void
    {
        $appointment->delete();

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('appointments')->flush();
        } else {
            Cache::flush();
        }
    }

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "appointments.page.{$page}.search.{$search}";

        $store = Cache::getStore();

        $build = function () use ($search, $perPage) {
            $q = $this->query();

            if ($search) {
                $q->where(function ($query) use ($search) {
                    $query->whereHas('patient', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })->orWhereHas('doctor', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })->orWhereHas('service', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })->orWhere('appointment_date', 'like', "%{$search}%")
                        ->orWhere('times', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%");
                });
            }

            return $q->latest('updated_at')->paginate($perPage);
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('appointments')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }
}
