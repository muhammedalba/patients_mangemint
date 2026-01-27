import { usePage } from "@inertiajs/react";

export default function AppointmentsTodayTable({
    appointments,
}: {
    appointments: any[];
}) {

    const { stats } = usePage().props as any;
    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            
            {appointments?.length === 0 ? (
                <p className="text-gray-500">لا توجد مواعيد اليوم</p>
            ) : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-3 py-2 text-right">
                                وقت الموعد
                            </th>
                            <th className="border px-3 py-2 text-right">
                                اسم المريض
                            </th>
                            <th className="border px-3 py-2 text-right">
                                اسم الطبيب
                            </th>
                            <th className="border px-3 py-2 text-right">
                                حالة الموعد
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((a) => (
                            <tr key={a.id} className="even:bg-gray-50">
                                <td className="border px-3 py-2">
                                    {a.start_time} – {a.end_time}
                                </td>
                                <td className="border px-3 py-2">
                                    {a.patient?.name}
                                </td>
                                <td className="border px-3 py-2">
                                    {a.doctor?.name}
                                </td>
                                <td className="border px-3 py-2 capitalize">
                                    {a.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
