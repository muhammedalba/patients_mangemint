/**
 * Formats a date string or object into a localized Arabic date string.
 */
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return '-';

    try {
        const d = typeof date === 'string' ? new Date(date) : date;
        
        if (isNaN(d.getTime())) return '-';

        return d.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        return '-';
    }
}
