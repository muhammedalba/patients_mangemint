import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Patient } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function Show({
    patient,
    tooth,
}: {
    patient: Patient;
    tooth: any;
}) {
    console.log(patient, 'patient');
    console.log(tooth, 'tooth');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
        { title: patient.name, href: route('patients.details', patient.id) },
    ];

    const handleToothClick = (toothId: number) => {
        router.get(
            route('patients.details', { patient: patient.id, tooth: toothId }),
        );
    };

    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();

    const [selectedToothId, setSelectedToothId] = useState<number | null>(
        tooth ? tooth.id : null,
    );

    const handleDeleteTooth = (id: number) => {
        if (confirm('هل تريد حذف السن؟')) {
            router.delete(route('tooth.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteProcedure = (id: number) => {
        if (confirm('هل تريد حذف الإجراء؟')) {
            router.delete(route('procedures.destroy', id), {
                preserveScroll: true,
            });
        }
    };
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const teethGrid = {
        upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
        upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
        lowerLeft: [38, 37, 36, 35, 34, 33, 32, 31],
        lowerRight: [41, 42, 43, 44, 45, 46, 47, 48],
    };

    const renderTooth = (num: number) => (
        <div
            key={num}
            onClick={() => setSelectedTooth(num)}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-sm font-bold transition-all duration-200 ${
                selectedTooth === num
                    ? 'scale-110 bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:scale-105 hover:bg-blue-100'
            }`}
            title={`Tooth ${num}`}
        >
            {num}
        </div>
    );
    const procedures: { [key: number]: { name: string; date: string }[] } = {
        11: [{ name: 'Filling', date: '2025-10-01' }],
        24: [{ name: 'Extraction', date: '2025-09-15' }],
        36: [{ name: 'Crown', date: '2025-08-20' }],
    };
    const [newProcedure, setNewProcedure] = useState({
        name: '',
        description: '',
        cost: '',
        duration_minutes: '',
    });
    const [proceduresByTooth, setProceduresByTooth] = useState<{
        [key: number]: any[];
    }>({});
    const handleAddProcedureTeeth = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTooth) return;

        const updated = { ...proceduresByTooth };

        if (!updated[selectedTooth]) updated[selectedTooth] = [];

        updated[selectedTooth].push({
            ...newProcedure,
            date: new Date().toISOString().split('T')[0],
        });

        setProceduresByTooth(updated);
        setNewProcedure({
            name: '',
            description: '',
            cost: '',
            duration_minutes: '',
        });
        setShowForm(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Procedures : ${patient.name}`} />

            <div className="mx-auto max-w-3xl p-6">
                <h2 className="mb-4 text-center text-xl font-semibold">
                   FDI Tooth Grid
                </h2>

                <div className="flex flex-col items-center gap-4">
                    {/* Top Row */}
                    <div className="flex gap-4">
                        <div className="flex gap-1">
                            {teethGrid.upperRight.map(renderTooth)}
                        </div>
                        <div className="w-4" />
                        <div className="flex gap-1">
                            {teethGrid.upperLeft.map(renderTooth)}
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="h-4" />

                    {/* Bottom Row */}
                    <div className="flex gap-4">
                        <div className="flex gap-1">
                            {teethGrid.lowerLeft.map(renderTooth)}
                        </div>
                        <div className="w-4" />
                        <div className="flex gap-1">
                            {teethGrid.lowerRight.map(renderTooth)}
                        </div>
                    </div>
                </div>

                {selectedTooth && (
                    <p className="mt-6 text-center font-medium text-blue-700">
                        Selected Tooth: {selectedTooth}
                    </p>
                )}
            </div>
            {/* Procedure Panel */}
            {selectedTooth && (
                <div className="mt-6 rounded-lg bg-gray-50 p-4 shadow">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Procedures for Tooth {selectedTooth}
                        </h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="rounded bg-gray-400 px-4 py-2 text-gray-700"
                        >
                            Add Procedure
                        </button>
                    </div>

                    {proceduresByTooth[selectedTooth]?.length ? (
                        <table className="w-full border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-2 py-1">#</th>
                                    <th className="border px-2 py-1">Name</th>
                                    <th className="border px-2 py-1">
                                        Description
                                    </th>
                                    <th className="border px-2 py-1">Cost</th>
                                    <th className="border px-2 py-1">
                                        Duration
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {proceduresByTooth[selectedTooth].map(
                                    (procedure, i) => (
                                        <tr key={i}>
                                            <td className="border px-2 py-1">
                                                {i + 1}
                                            </td>
                                            <td className="border px-2 py-1">
                                                {procedure.name}
                                            </td>
                                            <td className="border px-2 py-1">
                                                {procedure.description}
                                            </td>
                                            <td className="border px-2 py-1">
                                                {procedure.cost}
                                            </td>
                                            <td className="border px-2 py-1">
                                                {procedure.duration_minutes}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-sm text-gray-500">
                            No procedures recorded.
                        </p>
                    )}
                </div>
            )}
            {showForm && selectedTooth && (
                <form
                    onSubmit={handleAddProcedureTeeth}
                    className="mt-4 space-y-3 rounded bg-white p-4 shadow"
                >
                    <h3 className="text-md font-semibold">
                        Add Procedure for Tooth {selectedTooth}
                    </h3>

                    <input
                        type="text"
                        placeholder="Procedure name"
                        value={newProcedure.name}
                        onChange={(e) =>
                            setNewProcedure({
                                ...newProcedure,
                                name: e.target.value,
                            })
                        }
                        className="w-full rounded border px-3 py-2"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        value={newProcedure.description}
                        onChange={(e) =>
                            setNewProcedure({
                                ...newProcedure,
                                description: e.target.value,
                            })
                        }
                        className="w-full rounded border px-3 py-2"
                    />

                    <input
                        type="number"
                        placeholder="Cost"
                        value={newProcedure.cost}
                        onChange={(e) =>
                            setNewProcedure({
                                ...newProcedure,
                                cost: e.target.value,
                            })
                        }
                        className="w-full rounded border px-3 py-2"
                    />

                    <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={newProcedure.duration_minutes}
                        onChange={(e) =>
                            setNewProcedure({
                                ...newProcedure,
                                duration_minutes: e.target.value,
                            })
                        }
                        className="w-full rounded border px-3 py-2"
                    />

                    <button
                        type="submit"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        Save Procedure
                    </button>
                </form>
            )}

            {/* <div className="mx-auto mt-10 max-w-4xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold">الأسنان</h2>
                    <Link
                        href={route('tooth.create', { patient_id: patient.id })}
                        className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        إضافة سن
                    </Link>
                </div>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">ID</th>
                            <th className="border px-2 py-1">رقم السن</th>
                            <th className="border px-2 py-1">الحالة</th>
                            <th className="border px-2 py-1">ملاحظات</th>
                            <th className="border px-2 py-1">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patient.teeth.map((tooth, i) => (
                            <tr
                                key={tooth.id}
                                className={
                                    selectedToothId === tooth.id
                                        ? 'bg-blue-100'
                                        : ''
                                }
                            >
                                <td className="border px-2 py-1">{i + 1}</td>
                                <td className="border px-2 py-1">
                                    {tooth.tooth_number}
                                </td>
                                <td className="border px-2 py-1">
                                    {tooth.status}
                                </td>
                                <td className="border px-2 py-1">
                                    {tooth.notes}
                                </td>
                                <td className="border px-2 py-1">
                                    <Link
                                        href={route('tooth.edit', tooth.id)}
                                        className="mr-2 rounded bg-green-500 px-2 py-1 text-white"
                                    >
                                        تعديل
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDeleteTooth(tooth.id)
                                        }
                                        className="rounded bg-red-500 px-2 py-1 text-white"
                                    >
                                        حذف
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleToothClick(tooth.id)
                                        }
                                        className="rounded bg-blue-500 px-2 py-1 text-white"
                                    >
                                        عرض الإجراءات
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {tooth && (
                <div className="mx-auto mt-10 max-w-4xl rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">الإجراءات</h2>
                        <Link
                            href={route('procedures.create', {
                                patient_id: patient.id,
                                tooth_id: selectedToothId,
                            })}
                            className="inline-block rounded bg-blue-500 px-4 py-2 text-white"
                        >
                            إضافة إجراء
                        </Link>
                    </div>
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">ID</th>
                                <th className="border px-2 py-1">الاسم</th>
                                <th className="border px-2 py-1">الوصف</th>
                                <th className="border px-2 py-1">التكلفة</th>
                                <th className="border px-2 py-1">
                                    المدة (بالدقائق)
                                </th>
                                <th className="border px-2 py-1">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tooth.procedures.map((procedure: any, i: any) => (
                                <tr key={procedure.id}>
                                    <td className="border px-2 py-1">
                                        {i + 1}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {procedure.name}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {procedure.description}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {procedure.cost}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {procedure.duration_minutes}
                                    </td>
                                    <td className="border px-2 py-1">
                                        <Link
                                            href={route(
                                                'procedures.edit',
                                                procedure.id,
                                            )}
                                            className="mr-2 rounded bg-green-500 px-2 py-1 text-white"
                                        >
                                            تعديل
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDeleteProcedure(
                                                    procedure.id,
                                                )
                                            }
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
            )} */}
        </AppLayout>
    );
}
