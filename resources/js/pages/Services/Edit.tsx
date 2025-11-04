import AppLayout from '@/layouts/app-layout';
import { Service, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function EditService({ service, categories }: { service: Service, categories: any[] }) {
    const { data, setData, patch, processing, errors } = useForm<{
        name: string;
        description: string;
        price: number;
        category_id: string;
    }>({
        name: service.name || '',
        description: service.description || '',
        price: service.price || 0,
        category_id: service.category_id || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        patch(route('services.update', service.id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Services', href: route('services.index') },
        {
            title: `Update: ${service.name}`,
            href: route('services.edit', service.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Update Service: ${service.name}`} />
            <div className="mx-auto mt-4 w-xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                    Update Service Information
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* select category */}
                    <div>
                        <label
                            htmlFor="category_id"
                            className="mb-2 block text-gray-700"
                        >
                            Category
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={data.category_id}
                            onChange={(e) =>
                                setData('category_id', e.target.value)
                            }
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category: any) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="name" className="mb-2 block text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Service name"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="price" className="mb-2 block text-gray-700">
                            Price
                        </label>
                        <input
                            id="price"
                            type="number"
                            name="price"
                            value={data.price}
                            onChange={(e) => setData('price', parseFloat(e.target.value))}
                            placeholder="Service price"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-2 block text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Service description"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={3}
                        ></textarea>
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-200 ${
                                processing
                                    ? 'cursor-not-allowed bg-blue-400'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {processing ? 'Updating ...' : 'Update Service'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
