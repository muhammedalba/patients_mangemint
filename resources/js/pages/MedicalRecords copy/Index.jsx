
import { Inertia } from '@inertiajs/inertia';
import { Link,usePage } from '@inertiajs/react';

export default function Index() {
    const { records } = usePage().props;

    const handleDelete = (id) => {
        if(confirm('هل تريد حذف السجل الطبي؟')) {
            Inertia.delete(route('medical_records.destroy', id));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">السجلات الطبية</h1>
            <Link href={route('medical_records.create')} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
                إضافة سجل طبي
            </Link>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">المريض</th>
                        <th className="border px-2 py-1">ملاحظات</th>
                        <th className="border px-2 py-1">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(r => (
                        <tr key={r.id}>
                            <td className="border px-2 py-1">{r.id}</td>
                            <td className="border px-2 py-1">{r.patient?.name}</td>
                            <td className="border px-2 py-1">{r.notes}</td>
                            <td className="border px-2 py-1">
                                <Link href={route('medical_records.edit', r.id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">تعديل</Link>
                                <button onClick={() => handleDelete(r.id)} className="bg-red-500 text-white px-2 py-1 rounded">حذف</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
