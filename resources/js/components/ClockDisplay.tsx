import { useEffect, useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';

export function ClockDisplay() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = useMemo(
        () =>
            now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            }),
        [now]
    );

    const dateString = useMemo(
        () =>
            now.toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        [now]
    );

    return (
        <>
            <div className="flex items-center gap-2 text-indigo-300 mb-1">
                <CalendarDays className="h-5 w-5" />
                <span className="text-lg font-medium">{dateString}</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight md:text-4xl font-mono tabular-nums text-white">
                {timeString}
            </h1>
        </>
    );
}
