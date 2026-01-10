import AppointmentsTodayTable from '@/components/TodayAppointmentsTable';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const Breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'جدول اليوم',
        href: '/today',
    },
];

export default function Statistics() {
    const { stats } = usePage().props as any;
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const syrianTime = new Date(
        now.toLocaleString('en-US', { timeZone: 'Asia/Damascus' }),
    );

    const formattedDate = syrianTime.toLocaleDateString('en-SY', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = syrianTime.toLocaleTimeString('en-SY', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <AppLayout breadcrumbs={Breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex flex-row justify-between'>
                <div><h3 className="mb-2 text-lg font-medium text-gray-700">جدول مواعيد اليوم</h3>
            <span className="text-gray-600 text-sm">{formattedDate} — {formattedTime}</span></div>
            <div>
                <img src='zirconLogo.png' alt='logo' className='h-16 w-30'/>
            </div>
            </div>
                
            

            <AppointmentsTodayTable appointments={stats.appointmentsToday} />
            </div>
        </AppLayout>
    );
}
