import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';

export default function Index() {
    const { payments } = usePage().props;

    const handleDelete = (id) => {
        if(confirm('هل تريد حذف الدفع؟')) {
            Inertia.delete(route('payments.destroy', id));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">المدفوعات</h1>
            <InertiaLink href={route('payments.create')} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
                إضافة دفعة
            </InertiaLink>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">المريض</th>
                        <th className="border px-2 py-1">المبلغ</th>
                        <th className="border px-2 py-1">التاريخ</th>
                        <th className="border px-2 py-1">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(p => (
                        <tr key={p.id}>
                            <td className="border px-2 py-1">{p.id}</td>
                            <td className="border px-2 py-1">{p.patient?.name}</td>
                            <td className="border px-2 py-1">{p.amount}</td>
                            <td className="border px-2 py-1">{p.date}</td>
                            <td className="border px-2 py-1">
                                <InertiaLink href={route('payments.edit', p.id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">تعديل</InertiaLink>
                                <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-2 py-1 rounded">حذف</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
