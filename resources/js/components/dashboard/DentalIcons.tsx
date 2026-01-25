import React from 'react';

// Custom Tooth Icon Component - Professional Anatomical Look
export const ToothIcon = React.memo(function ToothIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Anatomical Tooth Shape */}
            <path d="M12 2C8 2 5.5 3.5 5 7c-.3 2-.5 4-.5 6.5 0 3 .5 5.5 1 8 0 .5.5 1 1.5 1 1.5 0 2-2 2.5-4 .2-.8.5-1.5 1-1.5s.8.7 1 1.5c.5 2 1 4 2.5 4 1 0 1.5-.5 1.5-1 .5-2.5 1-5 1-8 0-2.5-.2-4.5-.5-6.5C18.5 3.5 16 2 12 2z" />
            {/* Occlusal surface detail */}
            <path d="M8 9c1.5 1.5 3.5 2 4 2s2.5-.5 4-2" />
            {/* Crown highlight/depth */}
            <path d="M12 2v3" />
        </svg>
    );
});

// Dental Chair Icon - Modern Professional Look
export const DentalChairIcon = React.memo(function DentalChairIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Modern Dental Chair structure */}
            <path d="M4 18h16" />
            <path d="M6 18v-2a2 2 0 0 1 2-2h10" />
            <path d="M8 14V9a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" />
            <path d="M18 11h2" />
            <path d="M11 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
            {/* Instrument Arm */}
            <path d="M7 11c-1 0-2-1-2-2V6" />
            <circle cx="5" cy="5" r="1" />
        </svg>
    );
});
