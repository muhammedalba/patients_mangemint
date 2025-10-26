import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: PaginationProps) {
    return (
        <nav className="mt-4 flex items-center justify-between">
            <div className="flex flex-1 justify-between sm:justify-end">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        className={cn(
                            'relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium',
                            link.active
                                ? 'z-10 border-indigo-500 bg-indigo-50 text-indigo-600'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
                            link.url === null && 'cursor-not-allowed opacity-50'
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </nav>
    );
}
