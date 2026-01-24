import { Calendar, Sparkles } from 'lucide-react';
import React from 'react';
import { FloatingSparkle, PulseRing } from './Animations';
import { ToothIcon } from './DentalIcons';
// dynamic import
const ClockDisplay = React.lazy(() => import('../ClockDisplay').then((module) => ({ default: module.ClockDisplay })));

interface DashboardHeaderProps {
    clinicName: string;
    tagline: string;
}

export const DashboardHeader = React.memo(function DashboardHeader({
    clinicName,
    tagline,
}: DashboardHeaderProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-l from-teal-600 via-cyan-600 to-blue-600 p-6 text-white shadow-xl shadow-cyan-500/25 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/30">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-10 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                    <ToothIcon className="h-20 w-20" />
                </div>
                <div className="absolute bottom-4 left-20 transition-transform duration-700 group-hover:-rotate-12 group-hover:scale-110">
                    <ToothIcon className="h-16 w-16" />
                </div>
                <div className="absolute top-1/2 left-1/3 transition-transform duration-500 group-hover:scale-125">
                    <FloatingSparkle delay={0} />
                </div>
                <div className="absolute top-1/4 left-1/2">
                    <FloatingSparkle delay={500} />
                </div>
                <div className="absolute bottom-1/3 left-2/3">
                    <FloatingSparkle delay={1000} />
                </div>
            </div>

            {/* Gradient Overlay Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 ring-2 ring-white/30 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 group-hover:ring-white/40">
                        <img src='/zirconLogo.png' alt='Zircon Logo' className='h-auto w-auto transition-transform duration-300 group-hover:scale-110' />
                        <PulseRing />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                            {clinicName}
                        </h1>
                        <p className="mt-1 flex items-center gap-2 text-sm text-cyan-100 md:text-base">
                            <Sparkles className="h-4 w-4 animate-pulse" style={{ animationDuration: '2s' }} />
                            {tagline}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:ring-white/30">
                    <div className="relative">
                        <Calendar className="h-5 w-5 text-cyan-200" />
                    </div>
                    <div className="text-sm">
                          <ClockDisplay />
                    </div>
                </div>
            </div>
        </div>
    );
});
