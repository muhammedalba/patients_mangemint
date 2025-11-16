<?php

// app/Http/Controllers/AppointmentController.php

namespace App\Http\Controllers;

use App\Domain\Appointments\DTOs\AppointmentData;
use App\Http\Requests\AppointmentStoreRequest;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class ApointmentController extends Controller
{
    // ثابت: طول الـ slot بالدقائق
    private int $slotMinutes;

    public function __construct()
    {
        $this->slotMinutes = config('appointments.slot_minutes', 30);
    }

    // توليد قائمة الـ slots داخل فترة العمل (من startTime إلى endTime)
    // يُرجع مصفوفة من عناصر: ['start' => '09:00', 'end' => '09:30']
    private function generateTimeSlots(string $workStart = '09:00', string $workEnd = '17:00'): array
    {
        $slots = [];
        $current = Carbon::createFromTimeString($workStart);
        $end = Carbon::createFromTimeString($workEnd);
        while ($current->lt($end)) {
            $slotStart = $current->format('H:i');
            $slotEnd = $current->copy()->addMinutes($this->slotMinutes)->format('H:i');
            $slots[] = [
                'start' => $slotStart,
                'end' => $slotEnd,
            ];
            $current->addMinutes($this->slotMinutes);
        }

        return $slots;
    }

    /**
     * GET /api/available-slots?date=2025-11-20&duration_slots=2
     * يُرجع الـ slots القابلة للحجز بالنسبة لليوم ولعدد الـ slots المطلوب.
     */
    public function availableSlots(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'duration_slots' => 'sometimes|integer|min:1'
        ]);

        $date = $data['date'];
        $durationSlots = $data['duration_slots'] ?? 1;
        $desiredMinutes = $durationSlots * $this->slotMinutes;

        // توليد كل الـ slots خلال يوم العمل (يمكن جعل ساعات العمل من الإعدادات)
        $allSlots = $this->generateTimeSlots('09:00', '17:00');

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
        $available = array_values(array_map(function ($s) use ($desiredMinutes) {
            return [
                'start' => $s['start'],
                'end' => Carbon::createFromFormat('H:i', $s['start'])->addMinutes($desiredMinutes)->format('H:i'),
                'duration_minutes' => $desiredMinutes,
                'slots' => $desiredMinutes / $this->slotMinutes
            ];
        }, $available));
        return response()->json([
            'available_appointments' => $available
        ]);
        // return Inertia::render('Appointments/Create', [
        //     'available_appointments' => $available,
        // ]);
    }
}
