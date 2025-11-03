export interface Treatment {
    name: string;
    cost: number;
}

export interface TreatmentCategory {
    name: string;
    treatments: Treatment[];
}

export const TreatmentCategories: TreatmentCategory[] = [
    {
        name: 'تنظيف الأسنان',
        treatments: [
            { name: 'تنظيف عادي', cost: 100 },
            { name: 'تنظيف عميق', cost: 200 },
        ],
    },
    {
        name: 'تبييض الأسنان',
        treatments: [
            { name: 'تبييض ليزري', cost: 600 },
            { name: 'تبييض منزلي', cost: 300 },
        ],
    },
    {
        name: 'القلع والجراحة',
        treatments: [
            { name: 'قلع سن', cost: 150 },
            { name: 'قلع ضرس عقل', cost: 250 },
        ],
    },
    {
        name: 'الحشوات',
        treatments: [
            { name: 'حشوة تجميلية', cost: 180 },
            { name: 'حشوة معدنية', cost: 120 },
        ],
    },
    {
        name: 'التركيبات',
        treatments: [
            { name: 'تركيبة ثابتة', cost: 800 },
            { name: 'تركيبة متحركة', cost: 500 },
        ],
    },
];
