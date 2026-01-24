import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  search?: string;
  perPage?: number | string;
  baseRoute: string;
}

export default function Pagination({ links, search, perPage, baseRoute }: PaginationProps) {
  const handleClick = (url: string | null) => {
    if (!url) return;


    const urlObj = new URL(url);
    const page = urlObj.searchParams.get('page') || '1';

    router.get(baseRoute, {
      page,
      search,
      perPage,
    }, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <nav className="mt-4 flex items-center justify-between">
      <div className="flex flex-1 justify-between sm:justify-end flex-wrap">
        {links.map((link, index) => (
          <button
            key={index}
            disabled={!link.url}
            onClick={() => handleClick(link.url)}
            className={cn(
              'relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium',
              index % 2 != 0 && 'hidden',
              link.active
                ? 'z-10 inline-flex border-indigo-500 bg-indigo-50 text-indigo-600'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
                index == links.length - 1 && 'inline-flex',
              !link.url && 'cursor-not-allowed opacity-50'
            )}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>
    </nav> 
  );
}
