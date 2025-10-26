import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';

export default function Index() {
    const { invoices } = usePage().props;

    const handleDelete = (id) => {
        if(confirm('هل تريد حذف الفاتورة؟')) {
            Inertia.delete(route('invoices.destroy', id));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">الفواتير</h1>
            <InertiaLink href={route('invoices.create')} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
                إضافة فاتورة
            </InertiaLink>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">المريض</th>
                        <th className="border px-2 py-1">المبلغ الكلي</th>
                        <th className="border px-2 py-1">الحالة</th>
                        <th className="border px-2 py-1">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map(inv => (
                        <tr key={inv.id}>
                            <td className="border px-2 py-1">{inv.id}</td>
                            <td className="border px-2 py-1">{inv.patient?.name}</td>
                            <td className="border px-2 py-1">{inv.total}</td>
                            <td className="border px-2 py-1">{inv.status}</td>
                            <td className="border px-2 py-1">
                                <InertiaLink href={route('invoices.edit', inv.id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">تعديل</InertiaLink>
                                <button onClick={() => handleDelete(inv.id)} className="bg-red-500 text-white px-2 py-1 rounded">حذف</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
