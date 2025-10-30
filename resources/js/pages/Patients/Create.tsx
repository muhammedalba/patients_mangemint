import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

interface PatientFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    birth_date: string;
    gender: 'male' | 'female' | '';
}

export default function CreatePatient() {
    const { data, setData, post, processing, errors, reset } = useForm<PatientFormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
        birth_date: '',
        gender: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('patients.store'), {
            onSuccess: () => reset(),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Patients', href: route('patients.index') },
        { title: 'Add new patient', href: route('patients.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add new patient" />
            <div className="mx-auto mt-4 w-xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-center text-xl font-bold text-gray-700">
                   Add new patient
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-2 block text-gray-700">Full name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="FullName"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="birth_date" className="mb-2 block text-gray-700">Birth Date</label>
                        <input
                            id="birth_date"
                            type="date"
                            name="birth_date"
                            value={data.birth_date}
                            onChange={(e) => setData('birth_date', e.target.value)}
                            placeholder="Birth year"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.birth_date && <p className="mt-1 text-sm text-red-500">{errors.birth_date}</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="mb-2 block text-gray-700">Phone</label>
                        <input
                            id="phone"
                            type="text"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Phone"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                    </div>

                    <div className='flex justify-between'>
                        <div>
                        <label htmlFor="gender" className="mb-2 block text-gray-700">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={data.gender}
                            onChange={(e) => setData('gender', e.target.value as 'male' | 'female')}
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Choose gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                    </div>
                    <div>
                        <label htmlFor="marital_status" className="mb-2 block text-gray-700">Marital status</label>
                        <select
                            id="marital_status"
                            name="marital_status"
                            value={data.marital_status}
                            onChange={(e) => setData('gender', e.target.value as 'single' | 'married')}
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">Choose status</option>
                            <option value="male">Single</option>
                            <option value="female">Married</option>
                        </select>
                        {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.marital_status}</p>}
                    </div>
                    </div>

                    <div>
                        <label htmlFor="address" className="mb-2 block text-gray-700">Chronic Diseases</label>
                        <textarea
                            id="diseases"
                            name="diseases"
                            value={data.diseases}
                            onChange={(e) => setData('diseases', e.target.value)}
                            placeholder="Diseases"
                            className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows={1}
                        ></textarea>
                        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.diseases}</p>}
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
                            {processing ? 'Saving ... ' : 'Save Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
