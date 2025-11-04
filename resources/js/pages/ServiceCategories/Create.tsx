import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
export default function CreateServiceCategory() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Service Categories',
            href: route('service-categories.index'),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Service Category" />
            <div>create</div>;
        </AppLayout>
    );
}
