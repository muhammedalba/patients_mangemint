import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/react';

export default function Index() {
    const { invoices } = usePage().props;

    const handleDelete = (id) => {
        if (confirm('هل تريد حذف الفاتورة؟')) {
            Inertia.delete(route('invoices.destroy', id));
        }
    };

    return (
        <div>
            <h1 className="mb-4 text-2xl font-bold">الفواتير</h1>
            <Link
                href={route('invoices.create')}
                className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white"
            >
                إضافة فاتورة
            </Link>
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
                    {invoices.map((inv) => (
                        <tr key={inv.id}>
                            <td className="border px-2 py-1">{inv.id}</td>
                            <td className="border px-2 py-1">
                                {inv.patient?.name}
                            </td>
                            <td className="border px-2 py-1">{inv.total}</td>
                            <td className="border px-2 py-1">{inv.status}</td>
                            <td className="border px-2 py-1">
                                <Link
                                    href={route('invoices.edit', inv.id)}
                                    className="mr-2 rounded bg-green-500 px-2 py-1 text-white"
                                >
                                    تعديل
                                </Link>
                                <button
                                    onClick={() => handleDelete(inv.id)}
                                    className="rounded bg-red-500 px-2 py-1 text-white"
                                >
                                    حذف
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
