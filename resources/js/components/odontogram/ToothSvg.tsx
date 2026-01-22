import { cn } from '@/lib/utils';
import { Procedure, Tooth } from '@/types';
import { memo } from 'react';

type ToothSVGProps = {
    toothNumber: string | number;
    type: string;
    className?: string;
    onClick?: () => void;
    procedure?: Procedure | null;
    tooth?: Tooth;
};

// Default styling for a clean, medical look
const DEFAULT_FILL = '#ffffff';
const DEFAULT_STROKE = '#cbd5e1'; // slate-300

const ToothSVG = memo(function ToothSVG({
    toothNumber,
    type,
    className = '',
    onClick,
    procedure,
    tooth,
}: ToothSVGProps) {
    // Determine fill color based on procedure/status
    let fillColor = DEFAULT_FILL;
    let strokeColor = DEFAULT_STROKE;
    const strokeWidth = 1.5;

    // Specific visual overrides based on class names if strictly needed,
    // but preferring the props-based approach for clean logic.
    if (
        className?.includes('tooth-extraction') ||
        tooth?.status === 'extracted'
    ) {
        fillColor = '#e2e8f0'; // Slate-200 (Missing/Extracted)
        strokeColor = '#94a3b8';
    }

    const isSelected = className?.includes('ring-2'); // simplistic check if parent adds ring

    return (
        <div
            className={cn(
                'tooth-wrapper relative flex cursor-pointer flex-col items-center justify-center rounded-lg p-1 transition-transform hover:scale-105 active:scale-95',
                isSelected && 'bg-teal-50 ring-1 ring-teal-200',
            )}
            onClick={onClick}
            title={
                procedure
                    ? `${procedure.name} (${new Date(procedure.processing_date).toLocaleDateString()})`
                    : `سن ${toothNumber}`
            }
        >
            <svg
                width={42}
                height={62}
                viewBox="0 0 100 140"
                className={cn('tooth transition-all duration-300', className)}
                style={{
                    filter: procedure
                        ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                        : 'none',
                }}
            >
                <g
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill={fillColor}
                    transition="fill 0.3s ease"
                >
                    {/* Crown & Root Paths merged or separate for better coloring logic later if needed */}
                    {type === 'incisor' && (
                        <path d="M25 20 C27 12 37 8 50 8 C63 8 73 12 75 20 C77 28 77 40 75 50 C73 60 67 68 50 70 C33 68 27 60 25 50 C23 40 23 28 25 20 Z M37 70 C35 82 33 96 33 110 C33 122 37 136 50 138 C63 136 67 122 67 110 C67 96 65 82 63 70 Z" />
                    )}

                    {type === 'canine' && (
                        <path d="M29 22 C31 14 39 10 50 10 C61 10 69 14 71 22 C73 30 73 40 71 48 C69 56 63 62 50 64 C37 62 31 56 29 48 C27 40 27 30 29 22 Z M39 64 C37 76 35 92 35 108 C35 122 39 138 50 140 C61 138 65 122 65 108 C65 92 63 76 61 64 Z" />
                    )}

                    {type === 'premolar' && (
                        <path d="M27 30 C29 22 39 18 50 18 C61 18 71 22 73 30 C75 38 75 48 73 56 C71 64 65 70 50 72 C35 70 29 64 27 56 C25 48 25 38 27 30 Z M35 72 C33 82 31 92 31 102 C31 108 33 116 37 124 L41 132 C43 136 45 140 50 140 C55 140 57 136 59 132 L63 124 C67 116 69 108 69 102 C69 92 67 82 65 72 Z" />
                    )}

                    {type === 'molar' && (
                        <path d="M23 36 C25 26 37 22 50 22 C63 22 75 26 77 36 C79 44 79 54 77 62 C75 70 69 78 50 80 C31 78 25 70 23 62 C21 54 21 44 23 36 Z M31 80 C29 90 27 100 27 108 C27 114 29 122 33 128 L37 136 C39 140 41 144 45 144 M59 80 C61 90 63 100 63 108 C63 114 61 122 57 128 L53 136 C51 140 49 144 55 144" />
                    )}
                </g>

                {/* Overlays for specific conditions */}
                {(className?.includes('tooth-extraction') ||
                    tooth?.status === 'extracted') && (
                    <g stroke="#ef4444" strokeWidth="3" strokeLinecap="round">
                        <line x1="25" y1="25" x2="75" y2="115" />
                        <line x1="75" y1="25" x2="25" y2="115" />
                    </g>
                )}

                {className?.includes('tooth-filling') && (
                    <circle
                        cx="50"
                        cy="50"
                        r="12"
                        className={className}
                        fill="var(--filling-color)"
                        fillOpacity="0.8"
                    />
                )}

                {className?.includes('tooth-root') && (
                    <path
                        d="M50 75 L46 135 L54 135 Z"
                        fill="#ef4444"
                        opacity="0.6"
                    />
                )}

                {className?.includes('tooth-prosthetic') && (
                    <rect
                        x="25"
                        y="15"
                        width="50"
                        height="50"
                        rx="4"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                    />
                )}

                {className?.includes('tooth-surgery') && (
                    <rect
                        className="tooth-surgery-vertical"
                        x="45" // منتصف السن
                        y="60" // بداية الجذر
                        width="10"
                        height="30"
                        rx="3"
                    />
                )}
            </svg>

            <span className="tooth-number mt-1 text-[10px] font-bold text-slate-500 select-none">
                {toothNumber}
            </span>

            {/* Procedure Indicator Dot */}
            {procedure && (
                <div
                    className={cn(
                        'absolute -top-2 -right-2 h-2 w-2 border border-white shadow-sm',
                        'rotate-45',
                        procedure.status === 'completed'
                            ? 'bg-amber-400'
                            : 'bg-gray-400',
                    )}
                />
            )}
        </div>
    );
});

export default ToothSVG;
