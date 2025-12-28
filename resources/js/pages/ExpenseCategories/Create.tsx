import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';
export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('expense-categories.store'), { onSuccess: () => reset() });
    };

    return (
        <AppLayout>
            <Head title="Add Category" />
            <div className="mx-auto mt-6 max-w-md rounded bg-white p-6">
                <h1 className="mb-4 text-xl font-bold">Add Category</h1>
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
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
