<?php

namespace App\Domain\Appointments\Repositories;

use Carbon\Carbon;
use App\Models\Appointment;
use Exception;
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
        return Appointment::with(['patient:id,name', 'doctor:id,name', 'service:id,name'])->select('id', 'patient_id', 'user_id', 'service_id', 'date', 'status', 'start_time', 'end_time', 'duration_slots');
    }

    public function create(array $data): Appointment
    {
        $appointment = Appointment::create($data);

        $this->clearCache();

        return $appointment;
    }

    public function update(Appointment $appointment, array $data): Appointment
    {
        // حساب end_time فقط إذا تم تغيير start_time أو duration_slots
        if (isset($data['start_time']) || isset($data['duration_slots']) || isset($data['date'])) {

            $startTime = $data['start_time'] ?? $appointment->start_time;
            $slots = $data['duration_slots'] ?? $appointment->duration_slots;

            $data['end_time'] = $this->calculateEndTime($startTime, $slots);

            //
            $conflict = $this->isConflict(
                $data['date'] ?? $appointment->date,
                $data['start_time'] ?? $appointment->start_time,
                $data['end_time'] ?? $appointment->end_time,
                $data['user_id'] ?? $appointment->user_id
            );
            if ($conflict) {
                throw new Exception('الفترة الزمنية المطلوبة غير متاحة (يوجد تداخل).');
            }
        }

        $appointment->update($data);

        $this->clearCache();

        return $appointment;
    }

    public function delete(Appointment $appointment): void
    {
        $appointment->delete();

        $this->clearCache();
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
                    })->orWhere('date', 'like', "%{$search}%")
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
    /**
     * تحقق من وجود تداخل مع مواعيد موجودة لنفس التاريخ و (اختياريًا) لنفس الطبيب
     *
     * @param string $date YYYY-MM-DD
     * @param string $start H:i:s or H:i
     * @param string $end   H:i:s or H:i
     * @param int|null $userId optional — لو تريد فحص تضارب فقط لطبيب محدد
     * @return bool
     */
    public function isConflict(string $date, string $start, string $end, ?int $userId = null): bool
    {
        $query = Appointment::where('date', $date);


        if ($userId !== null) {
            $query->where('user_id', $userId);
        }

        // شروط التداخل: new_start < existing.end AND new_end > existing.start
        $query->where(function ($q) use ($start, $end) {
            $q->where('start_time', '<', $end)
                ->where('end_time', '>', $start);
        });
        // @dd($query->get());

        return $query->exists();
    }

    /**
     * Clear cache using tags.
     */
    private function clearCache(): void
    {
        $store = Cache::getStore();

        if ($store instanceof TaggableStore) {
            Cache::tags('appointments')->flush();
        } else {
            Cache::flush();
        }
    }
    /**
     * حساب end time بناءً على start_time وعدد الـ slots
     * كل Slot = 30 دقيقة
     */
    private function calculateEndTime(string $startTime, int $durationSlots): string
    {
        $minutes = $durationSlots * 30;

        return date("H:i", strtotime($startTime . " + {$minutes} minutes"));
    }
    // available_Slots
    public function  availableSlots(int $slotMinutes, array $data)
    {
        $date = $data['date'];
        $durationSlots = $data['duration_slots'] ?? 1;
        $desiredMinutes = $durationSlots * $slotMinutes;

        // توليد كل الـ slots خلال يوم العمل (يمكن جعل ساعات العمل من الإعدادات)
        $allSlots = $this->generateTimeSlots('09:00', '17:00', $slotMinutes);

        // جلب المواعيد الموجودة لهذا التاريخ
        $booked = Appointment::where('date', $date)->get();


        // نحول المواعيد إلى فترات Carbon لسهولة الحساب (بالأوقات الكاملة)
        $bookedIntervals = $booked->map(function ($a) use ($date) {
            $startTime = $a->start_time instanceof \Carbon\Carbon ? $a->start_time->format('H:i:s') : $a->start_time;
            $endTime = $a->end_time instanceof \Carbon\Carbon ? $a->end_time->format('H:i:s') : $a->end_time;

            return [
                'start' => Carbon::createFromFormat('Y-m-d H:i:s', "$date $startTime"),
                'end'   => Carbon::createFromFormat('Y-m-d H:i:s', "$date $endTime"),
            ];
        });



        // للكل slot نتحقق إذا يمكن امتداده durationSlots * slotMinutes بدون تداخل
        $available = array_filter($allSlots, function ($slot) use ($bookedIntervals, $date, $desiredMinutes) {
            $slotStart = Carbon::createFromFormat('Y-m-d H:i', $date . ' ' . $slot['start']);
            $slotEnd = $slotStart->copy()->addMinutes($desiredMinutes);

            // يجب أن يتوافق نهاية الامتداد مع نهاية يوم العمل (لا نجعل slotEnd يتجاوز نهاية العمل)
            // ملاحظة: generateTimeSlots ضمنت أن كل slot أولية مستقيمة ضمن فترة العمل، لكن الامتداد قد يتجاوزها.
            $workEnd = Carbon::createFromFormat('Y-m-d H:i', $date . ' 17:00');
            if ($slotEnd->gt($workEnd)) {
                return false;
            }

            // التحقق من التداخل: إذا كان أي موعد موجود يتقاطع مع [slotStart, slotEnd) نرفض هذا الـ slot
            foreach ($bookedIntervals as $interval) {
                if ($slotStart->lt($interval['end']) && $slotEnd->gt($interval['start'])) {
                    // يوجد تداخل
                    return false;
                }
            }

            // لا تداخل => slot متاح للامتداد المطلوب
            return true;
        });

        // إعادة النتيجة مرتبة ومفصّلة
        $available = array_values(array_map(function ($s) use ($desiredMinutes, $slotMinutes) {
            return [
                'start' => $s['start'],
                'end' => Carbon::createFromFormat('H:i', $s['start'])->addMinutes($desiredMinutes)->format('H:i'),
                'duration_minutes' => $desiredMinutes,
                'slots' => $desiredMinutes / $slotMinutes
            ];
        }, $available));
        return  $available;
    }
    // توليد قائمة الـ slots داخل فترة العمل (من startTime إلى endTime)
    // يُرجع مصفوفة من عناصر: ['start' => '09:00', 'end' => '09:30']
    private function generateTimeSlots(string $workStart = '09:00', string $workEnd = '17:00', $slotMinutes = 30): array
    {
        $slots = [];
        $current = Carbon::createFromTimeString($workStart);
        $end = Carbon::createFromTimeString($workEnd);
        while ($current->lt($end)) {
            $slotStart = $current->format('H:i');
            $slotEnd = $current->copy()->addMinutes($slotMinutes)->format('H:i');
            $slots[] = [
                'start' => $slotStart,
                'end' => $slotEnd,
            ];
            $current->addMinutes($slotMinutes);
        }

        return $slots;
    }
}
