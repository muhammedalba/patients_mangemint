import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';

export default function Edit() {
    const { payment, patients, errors } = usePage().props;
    const [form, setForm] = useState(payment);

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
    const handleSubmit = (e) => { e.preventDefault(); Inertia.post(route('payments.update', payment.id), form); };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">تعديل الدفعة</h1>
            <form onSubmit={handleSubmit}>
                <select name="patient_id" value={form.patient_id} onChange={handleChange} className="border px-2 py-1 mb-2 w-full">
                    <option value="">اختر المريض</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {errors.patient_id && <div className="text-red-500">{errors.patient_id}</div>}
                <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="المبلغ" className="border px-2 py-1 mb-2 w-full"/>
                {errors.amount && <div className="text-red-500">{errors.amount}</div>}
                <input type="date" name="date" value={form.date} onChange={handleChange} className="border px-2 py-1 mb-2 w-full"/>
                {errors.date && <div className="text-red-500">{errors.date}</div>}
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">تحديث</button>
            </form>
        </div>
    );
}
