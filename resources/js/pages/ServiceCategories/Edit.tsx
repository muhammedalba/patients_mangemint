


import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';

export default function EditServiceCategory() {
    const { category } = usePage<PageProps>().props;

    return (
        <AppLayout>

            <div className='mt-4'>
             edit
            </div>
        </AppLayout>
    );
}
