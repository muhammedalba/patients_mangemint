import { Sparkles } from 'lucide-react';
import React from 'react';

// Animated Pulse Ring Component
export const PulseRing = React.memo(function PulseRing() {
    return (
        <span 
            className="absolute inset-0 animate-ping rounded-full bg-white/30" 
            style={{ animationDuration: '2s' }} 
        />
    );
});

// Sparkle Animation Component
export const FloatingSparkle = React.memo(function FloatingSparkle({ delay = 0 }: { delay?: number }) {
    return (
        <Sparkles 
            className="h-4 w-4 text-white/40 animate-pulse" 
            style={{ animationDelay: `${delay}ms`, animationDuration: '3s' }} 
        />
    );
});
