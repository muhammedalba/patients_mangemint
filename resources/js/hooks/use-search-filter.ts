import { router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import type { VisitOptions } from '@inertiajs/core';
import { useAppToast } from '@/utils/toast';

interface UseSearchFilterOptions {
    routeName: string;
    initialSearch?: string;
    debounceMs?: number;
    preserveState?: boolean;
    preserveScroll?: boolean;
    replace?: boolean;
    dataKey?: string;
}

export function useSearchFilter({
    routeName,
    initialSearch = '',
    debounceMs = 300,
    preserveState = true,
    preserveScroll = true,
    replace = true,
    dataKey,
}: UseSearchFilterOptions) {
    const [search, setSearch] = useState(initialSearch);
    const [isLoading, setIsLoading] = useState(false);
    const isFirstMount = useRef(true);
 const { error } = useAppToast();
    // options  
    const visitOptions = useMemo<VisitOptions>(() => {
        const options: VisitOptions = {
            preserveState,
            preserveScroll,
            replace,
            onFinish: () => setIsLoading(false),
            onCancel: () => setIsLoading(false),
            onError: () =>{ setIsLoading(false); error('  حدث خطأ')}, 
        };

        if (dataKey) {
            options.only = [dataKey];
        }

        return options;
    }, [preserveState, preserveScroll, replace, dataKey]);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const resetSearch = useCallback(() => {
        setSearch('');
    }, []);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            setIsLoading(true);

            router.get(
                route(routeName),
                search ? { search } : {},
                visitOptions
            );
        }, debounceMs);

        return () => clearTimeout(timeout);
    }, [search, routeName, debounceMs, visitOptions]);

    return {
        search,
        setSearch,
        handleSearch,
        resetSearch,
        isLoading,
    };
}
