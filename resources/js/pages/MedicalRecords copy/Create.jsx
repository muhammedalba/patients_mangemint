import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

export default function Create() {
    const { patients, errors } = usePage().props;
    const [form, setForm] = useState({ patient_id:'', notes:'' });

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
    const handleSubmit = (e) => { e.preventDefault(); Inertia.post(route('medical_records.store'), form); };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">إضافة سجل طبي</h1>
            <form onSubmit={handleSubmit}>
                <select name="patient_id" value={form.patient_id} onChange={handleChange} className="border px-2 py-1 mb-2 w-full">
                    <option value="">اختر المريض</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {errors.patient_id && <div className="text-red-500">{errors.patient_id}</div>}
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="ملاحظات" className="border px-2 py-1 mb-2 w-full"></textarea>
                {errors.notes && <div className="text-red-500">{errors.notes}</div>}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">حفظ</button>
            </form>
        </div>
    );
}
