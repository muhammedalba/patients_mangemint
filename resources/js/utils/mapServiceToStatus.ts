import { ToothStatus } from '@/types';

export function mapServiceToStatus(category: any): ToothStatus {
    const name = category.name.toLowerCase();

    if (name.includes('قلع') || name.includes('extraction')) return 'extracted';

    if (name.includes('حشوة') || name.includes('fill')) return 'filled';

    if (name.includes('معالجة') || name.includes('treat')) return 'treated';

    if (name.includes('تاج') || name.includes('crown')) return 'crowned';

    if (name.includes('زرع') || name.includes('implant')) return 'implant';

    return 'treated';
}
