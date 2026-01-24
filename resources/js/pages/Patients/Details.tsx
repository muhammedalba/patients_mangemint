import DiscountForm from '@/components/DiscountForm';
import DownloadInvoice from '@/components/DownloadInvoice';
import { DynamicTable } from '@/components/DynamicTable';
import FinancialSummaryForm from '@/components/FinancialSummary';
import FormProcedure from '@/components/FormProcedure';
import DentalChart from '@/components/odontogram/DentalChart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import {
    PageProps,
    patientDetails,
    Procedure,
    ServiceCategory,
    Tooth,
    type BreadcrumbItem,
} from '@/types';
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
import { useAppToast } from '@/utils/toast';
import { Tab } from '@headlessui/react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    Activity,
    Calendar,
    Percent,
    Plus,
    Receipt,
    Stethoscope,
    User,
    Wallet,
} from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import { route } from 'ziggy-js';

interface PagePropsPatient extends PageProps {
    services_category: ServiceCategory[];
    patientDetails: patientDetails;
}
export default function Show() {
    const { services_category, patientDetails: initialPatientDetails } =
        usePage<PagePropsPatient>().props;

    const [patient, setPatient] = useState(initialPatientDetails);

    // UI States
    const [selectedTooth, setSelectedTooth] = useState<number>(1);
    const [showProcedureForm, setShowProcedureForm] = useState(false);
    const [showSideBar, setShowSideBar] = useState(false);
    const toothNumber = selectedTooth;
    const { success } = useAppToast();

    console.log(patient, 'patientDetails');
    // --- Memos & Helpers ---
    const teethMap = useMemo(() => {
        const map = new Map<number, number>();
        patient?.teeth?.forEach((tooth: Tooth) => {
            map.set(tooth.id, tooth.tooth_number);
        });
        return map;
    }, [patient?.teeth]);

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

    function getToothClasses(toothNumber: number): string {
        const list = proceduresByToothNumber[toothNumber];
        if (!list?.length) return '';
        const classes: string[] = [];
        list.forEach((procedure) => {
            const category = TREATMENT_NAME_TO_CATEGORY[procedure.name];
            if (!category) return;
            if (category === 'root') {
                const rootType = TREATMENT_NAME_TO_ROOT_TYPE[procedure.name];
                if (rootType)
                    classes.push(
                        `tooth-root ${ROOT_TREATMENT_STYLES[rootType]}`,
                    );
                return;
            }
            if (category === 'prosthetic') {
                const type = TREATMENT_NAME_TO_PROSTHETIC_TYPE[procedure.name];
                if (type)
                    classes.push(
                        `tooth-prosthetic ${PROSTHETIC_TREATMENT_STYLES[type]}`,
                    );
                return;
            }
            if (category === 'filling') {
                const type = TREATMENT_NAME_TO_FILLING_TYPE[procedure.name];
                if (type)
                    classes.push(
                        `tooth-filling ${FILLING_TREATMENT_STYLES[type]}`,
                    );
                return;
            }
            classes.push(TREATMENT_CATEGORY_STYLES[category]);
        });
        return classes.join(' ');
    }

    const columnsProcedures: ColumnDef<Procedure>[] = [
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
                    <Badge variant="outline" className="bg-slate-50">
                        {toothNumber ?? '-'}
                    </Badge>
                );
            },
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
        { title: 'ملف المريض', href: route('patients.details', patient?.id) },
    ];

    function getToothIdByNumber(toothNumber: number): number {
        const tooth = patient.teeth.find(
            (t) => String(t.tooth_number) === String(toothNumber),
        );
        return tooth?.id ?? 0;
    }

    function addProcedureOptimistic(procedure: Procedure) {
        setPatient((prev) => ({
            ...prev,
            procedures: [
                ...prev.procedures,
                { ...procedure, tooth_id: Number(procedure.tooth_id) },
            ],
        }));

        success(
            'تم إضافة الإجراء بنجاح',
            `تم تسجيل ${procedure.name} للسن رقم ${teethMap.get(Number(procedure.tooth_id))}`,
        );
    }

    const openFormProcedure = (toothNumber: number) => {
        console.log(toothNumber);
        setShowProcedureForm(true);
        setShowSideBar(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`ملف المريض : ${patient?.name}`} />

            <div className="flex flex-col gap-6 p-4 font-sans">
                {/* 1. Header Section */}
                <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {patient.name}
                            </h1>
                            <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" /> رقم الملف: #
                                    {patient.id}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> التسجيل:{' '}
                                    {new Date(
                                        patient?.medical_record?.created_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={`/appointments/create?patient_id=${patient?.id}`}
                        >
                            <Button className="gap-2 bg-slate-900 hover:bg-slate-800">
                                <Calendar className="h-4 w-4" /> موعد جديد
                            </Button>
                        </Link>
                        <Link href={`/payments/create/${patient?.id}`}>
                            <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
                                <Wallet className="h-4 w-4" /> إضافة دفعة
                            </Button>
                        </Link>
                        <Link href={`/procedures/create/${patient?.id}`}>
                            <Button
                                variant="outline"
                                className="gap-2 border-slate-300"
                            >
                                <Stethoscope className="h-4 w-4" /> إضافة إجراء
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {/* 2. Dental Chart (Left/Top - Large) */}
                    <div className="flex flex-col gap-6 lg:col-span-2 xl:col-span-3">
                        <Card className="overflow-hidden border-slate-200 shadow-sm">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Activity className="h-5 w-5 text-indigo-600" />
                                    المخطط السني (Dental Chart)
                                </CardTitle>
                                <CardDescription>
                                    اضغط على السن لإضافة أو عرض الإجراءات
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative min-h-[400px] p-6">
                                <DentalChart
                                    teeth={patient.teeth}
                                    getToothClasses={getToothClasses}
                                    getLastProcedure={getLastProcedure}
                                    onToothSelect={(toothNumber) => {
                                        setSelectedTooth(toothNumber);
                                        setShowSideBar(true);
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Tabs for Data */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                            <Tab.Group>
                                <div className="border-b border-slate-100 bg-slate-50/50 px-4">
                                    <Tab.List className="flex gap-4">
                                        {[
                                            {
                                                name: 'الإجراءات العلاجية',
                                                icon: Activity,
                                            },
                                            {
                                                name: 'الملخص المالي',
                                                icon: Wallet,
                                            },
                                            { name: 'الخصومات', icon: Percent },
                                            { name: 'الفواتير', icon: Receipt },
                                        ].map((item) => (
                                            <Tab as={Fragment} key={item.name}>
                                                {({ selected }) => (
                                                    <button
                                                        className={cn(
                                                            'flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition-all outline-none',
                                                            selected
                                                                ? 'border-teal-600 text-teal-700'
                                                                : 'border-transparent text-slate-500 hover:text-slate-800',
                                                        )}
                                                    >
                                                        <item.icon className="h-4 w-4" />
                                                        {item.name}
                                                    </button>
                                                )}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                </div>

                                <Tab.Panels className="p-6">
                                    {/* Procedures Panel */}
                                    <Tab.Panel className="focus:outline-none">
                                        {patient?.procedures ? (
                                            <DynamicTable
                                                data={patient.procedures}
                                                columns={columnsProcedures}
                                            />
                                        ) : (
                                            <p className="text-slate-500">
                                                جاري تحميل البيانات...
                                            </p>
                                        )}
                                    </Tab.Panel>

                                    {/* Financial Panel */}
                                    <Tab.Panel className="focus:outline-none">
                                        <FinancialSummaryForm
                                            summary={patient.financial_summary}
                                        />
                                    </Tab.Panel>

                                    {/* Discounts Panel */}
                                    <Tab.Panel className="focus:outline-none">
                                        <div className="max-w-xl">
                                            <h3 className="mb-4 text-lg font-semibold">
                                                إضافة خصم جديد
                                            </h3>
                                            <DiscountForm
                                                patientId={patient.id}
                                            />
                                        </div>
                                    </Tab.Panel>

                                    {/* Invoices Panel */}
                                    <Tab.Panel className="focus:outline-none">
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div>
                                                <h3 className="font-semibold text-slate-800">
                                                    فاتورة شاملة
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    تحميل فاتورة بجميع الإجراءات
                                                    والدفعات
                                                </p>
                                            </div>
                                            <DownloadInvoice
                                                patientId={patient.id}
                                            />
                                        </div>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </div>

                    {/* 3. Sidebar Panel (Right/Bottom) */}
                    <div className="lg:col-span-1 xl:col-span-1">
                        {showSideBar && toothNumber !== null ? (
                            <div className="sticky top-6 animate-in rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 shadow-sm duration-300 slide-in-from-right-4">
                                <div className="mb-4 flex items-center justify-between border-b border-indigo-100 pb-3">
                                    <h3 className="flex items-center gap-2 font-bold text-indigo-900">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                        تفاصيل سن {toothNumber}
                                    </h3>
                                    <button
                                        onClick={() => setShowSideBar(false)}
                                        className="text-indigo-400 hover:text-indigo-700"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {proceduresByToothNumber[toothNumber]
                                    ?.length ? (
                                    <div className="mb-6 space-y-3">
                                        {proceduresByToothNumber[
                                            toothNumber
                                        ].map((p) => (
                                            <div
                                                key={p.id}
                                                className="relative border-l-2 border-indigo-200 pl-4"
                                            >
                                                <div className="text-sm font-semibold text-slate-800">
                                                    {p.name}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {new Date(
                                                        p.processing_date,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6 text-center text-sm font-medium text-indigo-400">
                                        لا توجد إجراءات مسجلة
                                    </div>
                                )}

                                <Button
                                    onClick={() =>
                                        openFormProcedure(toothNumber)
                                    }
                                    className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> إدراج
                                    إجراء جديد
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-400">
                                <Stethoscope className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                <p className="text-sm">
                                    اضغط على أي سن في المخطط لعرض التفاصيل أو
                                    إضافة علاج.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Procedure Modal Form */}
                {showProcedureForm && toothNumber !== null && (
                    <div className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 fade-in">
                        <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
                            <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-4">
                                <h3 className="text-lg font-bold text-slate-800">
                                    إضافة إجراء طبي - سن {toothNumber}
                                </h3>
                                <button
                                    onClick={() => setShowProcedureForm(false)}
                                    className="text-slate-400 transition-colors hover:text-red-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="max-h-[85vh] overflow-y-auto p-6">
                                <FormProcedure
                                    services_category={services_category}
                                    patient={patient}
                                    toothId={getToothIdByNumber(toothNumber)}
                                    onClose={() => setShowProcedureForm(false)}
                                    onCreated={addProcedureOptimistic}
                                />
                            </div>
                        </div>
                    </div>
                )}
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
        if (!result[toothNumber]) result[toothNumber] = [];
        result[toothNumber].push(p);
    });
    return result;
}
