import { Shield, Sparkles, Star } from 'lucide-react';
import React from 'react';

interface FooterFeature {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    bgColor: string;
    hoverBgColor: string;
    iconColor: string;
}

const defaultFeatures: FooterFeature[] = [
    {
        icon: Shield,
        label: 'نظام آمن ومحمي',
        bgColor: 'bg-cyan-100',
        hoverBgColor: 'group-hover:bg-cyan-200',
        iconColor: 'text-cyan-600',
    },
    {
        icon: Star,
        label: 'خدمة عملاء متميزة',
        bgColor: 'bg-amber-100',
        hoverBgColor: 'group-hover:bg-amber-200',
        iconColor: 'text-amber-500',
    },
    {
        icon: Sparkles,
        label: 'تقنيات حديثة',
        bgColor: 'bg-violet-100',
        hoverBgColor: 'group-hover:bg-violet-200',
        iconColor: 'text-violet-500',
    },
];

interface FooterStatsProps {
    features?: FooterFeature[];
}

export const FooterStats = React.memo(function FooterStats({ 
    features = defaultFeatures 
}: FooterStatsProps) {
    return (
        <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-l from-slate-50 to-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex flex-wrap items-center justify-center gap-10 text-center">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div 
                            key={index}
                            className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
                        >
                            <div className={`rounded-lg p-2 transition-colors duration-300 ${feature.bgColor} ${feature.hoverBgColor}`}>
                                <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                            </div>
                            <span className="text-sm font-medium text-slate-600">
                                {feature.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
