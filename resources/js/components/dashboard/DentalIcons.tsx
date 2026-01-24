import React from 'react';

// Custom Tooth Icon Component
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
            <path d="M12 2C9.5 2 7.5 3.5 7 6c-.3 1.5-.5 3.5-.5 5.5 0 3 .5 5.5 1 7.5.5 2 1 3 2 3s1.5-1 2-2.5c.3-1 .5-1.5 .5-1.5s.2.5.5 1.5c.5 1.5 1 2.5 2 2.5s1.5-1 2-3c.5-2 1-4.5 1-7.5 0-2-.2-4-.5-5.5C16.5 3.5 14.5 2 12 2z" />
        </svg>
    );
});

// Dental Chair Icon
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
            <path d="M4 20h2l1-4h10l1 4h2M7 16l1-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2l1 6M12 8V4M9 4h6" />
        </svg>
    );
});
