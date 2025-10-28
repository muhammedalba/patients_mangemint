import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';

export default function Edit() {
    const { invoice, patients, errors } = usePage().props;
    const [form, setForm] = useState(invoice);

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
    const handleSubmit = (e) => { e.preventDefault(); Inertia.post(route('invoices.update', invoice.id), form); };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">تعديل الفاتورة</h1>
            <form onSubmit={handleSubmit}>
                <select name="patient_id" value={form.patient_id} onChange={handleChange} className="border px-2 py-1 mb-2 w-full">
                    <option value="">اختر المريض</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {errors.patient_id && <div className="text-red-500">{errors.patient_id}</div>}
                <input type="number" name="total" value={form.total} onChange={handleChange} placeholder="المبلغ الكلي" className="border px-2 py-1 mb-2 w-full"/>
                {errors.total && <div className="text-red-500">{errors.total}</div>}
                <select name="status" value={form.status} onChange={handleChange} className="border px-2 py-1 mb-2 w-full">
                    <option value="pending">قيد الانتظار</option>
                    <option value="paid">مدفوعة</option>
                </select>
                {errors.status && <div className="text-red-500">{errors.status}</div>}
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">تحديث</button>
            </form>
        </div>
    );
}
