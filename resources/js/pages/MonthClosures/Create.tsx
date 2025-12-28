import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';
export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        year: '',
        month: '',
    });
    console.log(errors);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('month-closures.closeMonth'), { onSuccess: () => reset() });
    };

    return (
        <AppLayout>
            <Head title="Close Month" />
            <div className="mx-auto mt-6 max-w-md rounded bg-white p-6">
                <h1 className="mb-4 text-xl font-bold">Close Month</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Year</label>
                        <input
                            type="number"
                            value={data.year}
                            onChange={(e) => setData('year', e.target.value)}
                            className="input"
                        />
                        {errors.year && (
                            <div className="text-sm text-red-500">
                                {errors.year}
                            </div>
                        )}
                    </div>
                    <div>
                        <label>Month</label>
                        <input
                            type="number"
                            value={data.month}
                            onChange={(e) => setData('month', e.target.value)}
                            className="input"
                        />
                        {errors.month && (
                            <div className="text-sm text-red-500">
                                {errors.month}
                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            disabled={processing}
                            className="btn btn-primary"
                        >
                            {processing ? 'Closing...' : 'Close Month'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
