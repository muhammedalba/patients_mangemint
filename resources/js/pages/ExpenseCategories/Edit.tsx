import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function Edit() {
    const { category } = usePage<any>().props;
    const { data, setData, post, processing, errors } = useForm({
        name: category.name || '',
        type: category.type || '',
        _method: 'PATCH',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('expense-categories.update', category.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Category" />
            <div className="mx-auto mt-6 max-w-md rounded bg-white p-6">
                <h1 className="mb-4 text-xl font-bold">Edit Category</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Name</label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="input"
                        />
                        {errors.name && (
                            <div className="text-sm text-red-500">
                                {errors.name}
                            </div>
                        )}
                    </div>
                    <div>
                        <label>Type</label>
                        <input
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="input"
                        />
                        {errors.type && (
                            <div className="text-sm text-red-500">
                                {errors.type}
                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            disabled={processing}
                            className="btn btn-primary"
                        >
                            {processing ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
