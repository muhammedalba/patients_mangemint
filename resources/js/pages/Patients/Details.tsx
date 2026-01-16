import DiscountForm from '@/components/DiscountForm';
import DownloadInvoice from '@/components/DownloadInvoice';
import { DynamicTable } from '@/components/DynamicTable';
import FinancialSummary from '@/components/FinancialSummary';
import FormProcedure from '@/components/FormProcedure';
import DentalChart from '@/components/odontogram/DentalChart';
import AppLayout from '@/layouts/app-layout';
import { Procedure, type BreadcrumbItem } from '@/types';
import {
    FILLING_TREATMENT_STYLES,
    PROSTHETIC_TREATMENT_STYLES,
    ROOT_TREATMENT_STYLES,
    TREATMENT_CATEGORY_STYLES,
    TREATMENT_NAME_TO_CATEGORY,
    TREATMENT_NAME_TO_FILLING_TYPE,
    TREATMENT_NAME_TO_PROSTHETIC_TYPE,
    TREATMENT_NAME_TO_ROOT_TYPE,
} from '@/utils/helper';
import { mapServiceToStatus } from '@/utils/mapServiceToStatus';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { route } from 'ziggy-js';

export default function Show() {
    //const { services_category, patientDetails, flash } = usePage<any>().props;
    const {
        services_category,
        patientDetails: initialPatientDetails,
        flash,
    } = usePage<any>().props;

    const [patient, setPatient] = useState(initialPatientDetails);

    const [openProcedures, setOpenProcedures] = useState(false);
    const [openSummary, setOpenSummary] = useState(false);
    const [openDiscount, setOpenDiscount] = useState(false);
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
    const [showProcedureForm, setShowProcedureForm] = useState(false);
    const [showSideBar, setShowSideBar] = useState(false);
    const [pendingToothStatus, setPendingToothStatus] =
        useState<string>('healthy');
    const toothNumber = selectedTooth;
    const { data, setData, processing, errors } = useForm({
        name: '',
        description: '',
        status: 'planned',
        cost: '',
        category: '',
        patient_id: patient.id,
        tooth_id: null,
    });
    console.log('patient state', patient);

    // console.log(patientDetails, 'patientDetails');
    // console.log(services_category, 'servicesCategory');
    // console.log(patientDetails.teeth);
    // console.log(patientDetails.procedures, 'procedures');
    // console.log(patientDetails.financial_summary);
    // console.log(patientDetails.payments);
    const teethMap = useMemo(() => {
        const map = new Map<number, number>(); // tooth_id -> tooth_number
        patient?.teeth?.forEach((tooth: any) => {
            map.set(tooth.id, tooth.tooth_number);
        });
        return map;
    }, [patient?.teeth]);

    const columnsProcedures = [
        { id: 'name', accessorKey: 'name', header: 'اسم الإجراء' },
        {
            id: 'processing_date',
            accessorKey: 'processing_date',
            header: 'تاريخ التنفيذ',
            cell: ({ row }) =>
                new Date(row.original.processing_date).toLocaleDateString(
                    'en-SY',
                ),
        },
        { id: 'cost', accessorKey: 'cost', header: 'التكلفة' },
        {
            id: 'tooth_number',
            header: 'رقم السن',
            cell: ({ row }) => {
                const toothId = row.original.tooth_id;
                const toothNumber = teethMap.get(toothId);

                return (
                    <span className="border px-2 py-1">
                        {toothNumber ?? '-'}
                    </span>
                );
            },
        },
    ];

    const handleToothClick = (tooth) => {
        console.log('Clicked tooth:', tooth);
        setSelectedTooth(tooth);
        setShowProcedureForm(true);
    };

    const handleServiceChange = (val, category) => {
        const selectedService = category.services.find(
            (s) => s.id.toString() === val,
        );

        if (!selectedService || !selectedTooth) return;

        const status = mapServiceToStatus(category.name);

        setData('name', selectedService.name);
        setData('cost', selectedService.price.toString());

        setPendingToothStatus(status);
    };

    const teethById = useMemo(() => {
        const map: Record<number, number> = {};

        patient.teeth.forEach((tooth) => {
            const id = Number(tooth.id);
            const number = Number(tooth.tooth_number);

            if (!Number.isNaN(id) && !Number.isNaN(number)) {
                map[id] = number;
            }
        });

        return map;
    }, [patient.teeth]);

    const proceduresByToothNumber = useMemo(() => {
        return groupProceduresByToothNumber(patient.procedures, teethById);
    }, [patient.procedures, teethById]);

    function getLastProcedure(toothNumber: number): Procedure | null {
        const list = proceduresByToothNumber[toothNumber];
        if (!list?.length) return null;
        return list[list.length - 1];
    }

    function getToothClass(toothNumber: number): string {
        const lastProcedure = getLastProcedure(toothNumber);
        if (!lastProcedure) return '';

        const category = TREATMENT_NAME_TO_CATEGORY[lastProcedure.name];
        if (!category) return '';

        if (category === 'root') {
            const rootType = TREATMENT_NAME_TO_ROOT_TYPE[lastProcedure.name];

            if (rootType) {
                return `tooth-root ${ROOT_TREATMENT_STYLES[rootType]}`;
            }
        }
        if (category === 'prosthetic') {
            const prostheticType =
                TREATMENT_NAME_TO_PROSTHETIC_TYPE[lastProcedure.name];

            if (prostheticType) {
                return `tooth-prosthetic ${PROSTHETIC_TREATMENT_STYLES[prostheticType]}`;
            }
        }
        if (category === 'filling') {
            const fillingType =
                TREATMENT_NAME_TO_FILLING_TYPE[lastProcedure.name];

            if (fillingType) {
                return `tooth-filling ${FILLING_TREATMENT_STYLES[fillingType]}`;
            }
        }

        return TREATMENT_CATEGORY_STYLES[category];
    }

    function getToothClasses(toothNumber: number): string {
        const list = proceduresByToothNumber[toothNumber];
        if (!list?.length) return '';

        const classes: string[] = [];

        list.forEach((procedure) => {
            const category = TREATMENT_NAME_TO_CATEGORY[procedure.name];
            if (!category) return;

            if (category === 'root') {
                const rootType = TREATMENT_NAME_TO_ROOT_TYPE[procedure.name];
                if (rootType) {
                    classes.push(
                        `tooth-root ${ROOT_TREATMENT_STYLES[rootType]}`,
                    );
                }
                return;
            }

            if (category === 'prosthetic') {
                const type = TREATMENT_NAME_TO_PROSTHETIC_TYPE[procedure.name];
                if (type) {
                    classes.push(
                        `tooth-prosthetic ${PROSTHETIC_TREATMENT_STYLES[type]}`,
                    );
                }
                return;
            }

            if (category === 'filling') {
                const type = TREATMENT_NAME_TO_FILLING_TYPE[procedure.name];
                if (type) {
                    classes.push(
                        `tooth-filling ${FILLING_TREATMENT_STYLES[type]}`,
                    );
                }
                return;
            }

            classes.push(TREATMENT_CATEGORY_STYLES[category]);
        });

        // 👈 المهم
        return classes.join(' ');
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
        {
            title: 'تفاصيل المريض',
            href: route('patients.details', patient?.id),
        },
    ];

    function getToothIdByNumber(toothNumber: number): number | null {
        const tooth = patient.teeth.find(
            (t) => String(t.tooth_number) === String(toothNumber),
        );

        return tooth ? tooth.id : null;
    }

    const openFormProcedure = (toothNumber) => {
        setShowProcedureForm(true);
        setShowSideBar(false);
    };

    function addProcedureOptimistic(procedure: Procedure) {
        setPatient((prev) => ({
            ...prev,
            procedures: [
                ...prev.procedures,
                {
                    ...procedure,
                    tooth_id: Number(procedure.tooth_id),
                },
            ],
        }));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تفاصيل المريض : ${patient?.name}`} />
            <div className="w-full gap-2 p-2">
                <div
                    className="mt-2 mr-2 rounded-lg border bg-white p-4 shadow"
                    dir="rtl"
                >
                    <div className="flex flex-row gap-2 rounded-2xl border p-2">
                        <Link
                            className="block w-full rounded-lg border-gray-600 bg-white px-4 py-2 text-center font-semibold transition hover:bg-gray-700"
                            href={`/appointments/create?patient_id=${patient?.id}`}
                        >
                            إضافة موعد
                        </Link>
                        <Link
                            className="block w-full rounded-lg bg-indigo-600 bg-white px-4 py-2 text-center font-semibold transition hover:bg-indigo-700"
                            href={`/payments/create/${patient?.id}`}
                        >
                            إضافة دفعة
                        </Link>
                        <Link
                            className="block w-full rounded-lg bg-blue-600 bg-white px-4 py-2 text-center font-semibold transition hover:bg-blue-700"
                            href={`/procedures/create/${patient?.id}`}
                        >
                            إضافة إجراء
                        </Link>
                    </div>
                </div>

                <div className="patient-details-layout">
                    <DentalChart
                        teeth={patient.teeth}
                        getToothClasses={getToothClasses}
                        onToothClick={handleToothClick}
                        getLastProcedure={getLastProcedure}
                        onToothSelect={(toothNumber) => {
                            console.log('clicked tooth', toothNumber);
                            setSelectedTooth(toothNumber);
                            setShowSideBar(true);
                        }}
                    />

                    {showSideBar && toothNumber !== null && (
                        <div className="tooth-panel">
                            <div className="flex items-center justify-between border-b pb-3">
                                <h1 className="text-sm font-semibold text-gray-700">
                                    الإجراءات على السن {toothNumber}
                                </h1>

                                <button
                                    type="button"
                                    onClick={() => setShowSideBar(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
                                    aria-label="إغلاق"
                                >
                                    ✕
                                </button>
                            </div>

                            {proceduresByToothNumber[toothNumber]?.length ? (
                                <ul>
                                    {proceduresByToothNumber[toothNumber].map(
                                        (p) => (
                                            <li key={p.id}>
                                                <div className="flex flex-row justify-between gap-y-2">
                                                    <strong>{p.name}</strong>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(
                                                            p.processing_date,
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            ) : (
                                <p>لا يوجد إجراءات سابقة على هذا السن</p>
                            )}
                            <button
                                className="add-procedure-btn"
                                onClick={() => {
                                    openFormProcedure(toothNumber);
                                }}
                            >
                                إضافة إجراء ➕
                            </button>
                        </div>
                    )}
                </div>

                {showProcedureForm && toothNumber !== null && (
                    <div className="fixed inset-x-0 top-10 bottom-10 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-full rounded-lg bg-white p-6 md:w-6xl">
                            <FormProcedure
                                data={data}
                                errors={errors}
                                processing={processing}
                                services_category={services_category}
                                patient={patient}
                                toothId={getToothIdByNumber(toothNumber)}
                                toothNumber={selectedTooth}
                                onServiceChange={handleServiceChange}
                                onClose={() => setShowProcedureForm(false)}
                                onCreated={addProcedureOptimistic}
                            />
                        </div>
                    </div>
                )}

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <section className="rounded-lg bg-white p-4 shadow">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-700">
                                الإجراءات
                            </h2>
                            <button
                                onClick={() =>
                                    setOpenProcedures(!openProcedures)
                                }
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                                {openProcedures ? 'إخفاء' : 'عرض'}
                            </button>
                        </div>
                        {openProcedures && (
                            <div>
                                {patient?.procedures ? (
                                    <DynamicTable
                                        data={patient.procedures}
                                        columns={columnsProcedures}
                                    />
                                ) : (
                                    <p className="text-gray-500">
                                        جاري تحميل الإجراءات...
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    <section className="rounded-lg bg-white p-4 shadow">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-700">
                                كشف الحساب
                            </h2>
                            <button
                                onClick={() => setOpenSummary(!openSummary)}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                            >
                                {openSummary ? 'إخفاء' : 'عرض'}
                            </button>
                        </div>
                        {openSummary && (
                            <FinancialSummary
                                summary={patient.financial_summary}
                            />
                        )}
                    </section>

                    <section className="rounded-lg bg-white p-4 shadow">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-700">
                                إضافة خصم
                            </h2>
                            <button
                                onClick={() => setOpenDiscount(!openDiscount)}
                                className="rounded-md bg-teal-600 px-4 py-2 text-sm text-white hover:bg-teal-700"
                            >
                                {openDiscount ? 'إغلاق' : 'إضافة'}
                            </button>
                        </div>
                        {openDiscount && (
                            <DiscountForm patientId={patient.id} />
                        )}
                    </section>

                    <section className="rounded-lg bg-white p-4 shadow">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-700">
                                الفاتورة
                            </h2>
                            <div className="flex items-center justify-center">
                                <DownloadInvoice patientId={patient.id} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
function groupProceduresByToothNumber(
    procedures: Procedure[],
    teethById: Record<number, number>,
): Record<number, Procedure[]> {
    const result: Record<number, Procedure[]> = {};

    procedures.forEach((p) => {
        const toothId = Number(p.tooth_id);
        const toothNumber = teethById[toothId];

        if (toothNumber == null) return;

        if (!result[toothNumber]) {
            result[toothNumber] = [];
        }

        result[toothNumber].push(p);
    });

    return result;
}
