<?php

namespace App\Domain\Appointments\Services;

use App\Domain\Appointments\DTOs\AppointmentData;
use App\Domain\Appointments\Repositories\AppointmentRepository;
use App\Models\Appointment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class AppointmentService
{
    private int $slotMinutes;
    private AppointmentRepository $repo;

    public function __construct(AppointmentRepository $repo)
    {
        $this->repo = $repo;
        $this->slotMinutes = config('appointments.slot_minutes', 30);
    }

    // available_Slots
    public function availableSlots($data)
    {

        try {
            return $this->repo->availableSlots($this->slotMinutes, $data);
        } catch (\Throwable $e) {
            Log::error('availableSlots  failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data,
            ]);
            throw $e;
        }
    }





    public function listAppointments(?string $search = null, int $perPage = 10)
    {

        try {
            return $this->repo->list($search, $perPage);
        } catch (\Throwable $e) {
            Log::error('Appointment list failed', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data->toArray(),
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

    /**
     * Book/create appointment with conflict check and transaction.
     *
     * @throws Exception
     */
    public function create(AppointmentData $data)
    {


        // parse start as Carbon (only time matters here)
        $start = Carbon::createFromFormat('H:i', $data->start_time);
        $minutes = $data->duration_slots * $this->slotMinutes;
        $end = $start->copy()->addMinutes($minutes);

        // format times to store in DB (H:i:s)
        $startTimeFormatted = $start->format('H:i:s');
        $endTimeFormatted = $end->format('H:i:s');

        // Optional: enforce business hours (customize as needed)
        $workDayEnd = Carbon::createFromFormat('H:i', '17:00')->format('H:i:s');
        if ($endTimeFormatted > $workDayEnd) {
            throw new Exception('المدة المختارة تتجاوز ساعات العمل المتاحة.');
        }

        return DB::transaction(function () use ($data, $startTimeFormatted, $endTimeFormatted) {
            // تحقق التداخل بالنسبة للطبيب (user_id) — عادة نتحقق لطبيب محدد
            $conflict = $this->repo->isConflict($data->date, $startTimeFormatted, $endTimeFormatted, $data->user_id);

            if ($conflict) {
                throw new Exception('الفترة الزمنية المطلوبة غير متاحة (يوجد تداخل).');
            }

            // إنشاء الموعد عبر الـ Repository
            return $this->repo->create([
                'patient_id'     => $data->patient_id,
                'user_id'        => $data->user_id,
                'service_id'     => $data->service_id,
                'date'           => $data->date,
                'start_time'     => $startTimeFormatted,
                'end_time'       => $endTimeFormatted,
                'duration_slots' => $data->duration_slots,
                'notes'          => $data->notes,
                'status'         => $data->status,
            ]);
        });
    }
}
