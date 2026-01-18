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
import { useMemo, useState, Fragment } from 'react';
import { route } from 'ziggy-js';
import { Tab } from '@headlessui/react';
import { 
    User, 
    Calendar, 
    CreditCard, 
    Activity, 
    Plus, 
    FileText, 
    Wallet, 
    Settings, 
    Printer,
    Stethoscope,
    Receipt,
    Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function Show() {
    const {
        services_category,
        patientDetails: initialPatientDetails,
        flash,
    } = usePage<any>().props;

    const [patient, setPatient] = useState(initialPatientDetails);
    
    // UI States
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
    const [showProcedureForm, setShowProcedureForm] = useState(false);
    const [showSideBar, setShowSideBar] = useState(false);
    const [pendingToothStatus, setPendingToothStatus] = useState<string>('healthy');
    
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

    // --- Memos & Helpers ---
    const teethMap = useMemo(() => {
        const map = new Map<number, number>();
        patient?.teeth?.forEach((tooth: any) => {
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
                if (rootType) classes.push(`tooth-root ${ROOT_TREATMENT_STYLES[rootType]}`);
                return;
            }
            if (category === 'prosthetic') {
                const type = TREATMENT_NAME_TO_PROSTHETIC_TYPE[procedure.name];
                if (type) classes.push(`tooth-prosthetic ${PROSTHETIC_TREATMENT_STYLES[type]}`);
                return;
            }
            if (category === 'filling') {
                const type = TREATMENT_NAME_TO_FILLING_TYPE[procedure.name];
                if (type) classes.push(`tooth-filling ${FILLING_TREATMENT_STYLES[type]}`);
                return;
            }
            classes.push(TREATMENT_CATEGORY_STYLES[category]);
        });
        return classes.join(' ');
    }

    const columnsProcedures = [
        { id: 'name', accessorKey: 'name', header: 'اسم الإجراء' },
        {
            id: 'processing_date',
            accessorKey: 'processing_date',
            header: 'تاريخ التنفيذ',
            cell: ({ row }) => new Date(row.original.processing_date).toLocaleDateString('en-SY'),
        },
        { id: 'cost', accessorKey: 'cost', header: 'التكلفة' },
        {
            id: 'tooth_number',
            header: 'رقم السن',
            cell: ({ row }) => {
                const toothId = row.original.tooth_id;
                const toothNumber = teethMap.get(toothId);
                return <Badge variant="outline" className="bg-slate-50">{toothNumber ?? '-'}</Badge>;
            },
        },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المرضى', href: route('patients.index') },
        { title: 'ملف المريض', href: route('patients.details', patient?.id) },
    ];

    function getToothIdByNumber(toothNumber: number): number | null {
        const tooth = patient.teeth.find((t) => String(t.tooth_number) === String(toothNumber));
        return tooth ? tooth.id : null;
    }

    const handleToothClick = (tooth) => {
        setSelectedTooth(tooth);
        setShowProcedureForm(true);
    };

    const handleServiceChange = (val, category) => {
        const selectedService = category.services.find((s) => s.id.toString() === val);
        if (!selectedService || !selectedTooth) return;
        const status = mapServiceToStatus(category.name);
        setData('name', selectedService.name);
        setData('cost', selectedService.price.toString());
        setPendingToothStatus(status);
    };

    const { toast } = useToast();

    function addProcedureOptimistic(procedure: Procedure) {
        setPatient((prev) => ({
            ...prev,
            procedures: [...prev.procedures, { ...procedure, tooth_id: Number(procedure.tooth_id) }],
        }));

        toast({
            title: "تم إضافة الإجراء بنجاح",
            description: `تم تسجيل ${procedure.name} للسن رقم ${teethMap.get(Number(procedure.tooth_id))}`,
            variant: "success",
        });
    }

    const openFormProcedure = (toothNumber) => {
        setShowProcedureForm(true);
        setShowSideBar(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`ملف المريض : ${patient?.name}`} />
            
            <div className="flex flex-col gap-6 p-4 font-sans">
                
                {/* 1. Header Section */}
                <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm border border-slate-100 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><User className="h-4 w-4" /> رقم الملف: #{patient.id}</span>
                                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> التسجيل: {new Date(patient.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                         <Link href={`/appointments/create?patient_id=${patient?.id}`}>
                            <Button className="bg-slate-900 hover:bg-slate-800 gap-2">
                                <Calendar className="h-4 w-4" /> موعد جديد
                            </Button>
                        </Link>
                         <Link href={`/payments/create/${patient?.id}`}>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 text-white">
                                <Wallet className="h-4 w-4" /> إضافة دفعة
                            </Button>
                        </Link>
                         <Link href={`/procedures/create/${patient?.id}`}>
                             <Button variant="outline" className="border-slate-300 gap-2">
                                <Stethoscope className="h-4 w-4" /> إضافة إجراء
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    
                    {/* 2. Dental Chart (Left/Top - Large) */}
                    <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-6">
                        <Card className="border-slate-200 shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Activity className="h-5 w-5 text-indigo-600" />
                                    المخطط السني (Dental Chart)
                                </CardTitle>
                                <CardDescription>اضغط على السن لإضافة أو عرض الإجراءات</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 relative min-h-[400px]">
                                <DentalChart
                                    teeth={patient.teeth}
                                    getToothClasses={getToothClasses}
                                    onToothClick={handleToothClick}
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
                                            { name: 'الإجراءات العلاجية', icon: Activity },
                                            { name: 'الملخص المالي', icon: Wallet },
                                            { name: 'الخصومات', icon: Percent },
                                            { name: 'الفواتير', icon: Receipt },
                                        ].map((item) => (
                                            <Tab as={Fragment} key={item.name}>
                                                {({ selected }) => (
                                                    <button className={cn(
                                                        "flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all outline-none",
                                                        selected ? "border-teal-600 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"
                                                    )}>
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
                                            <p className="text-slate-500">جاري تحميل البيانات...</p>
                                        )}
                                    </Tab.Panel>
                                    
                                    {/* Financial Panel */}
                                    <Tab.Panel className="focus:outline-none">
                                        <FinancialSummary summary={patient.financial_summary} />
                                    </Tab.Panel>
                                    
                                    {/* Discounts Panel */}
                                    <Tab.Panel className="focus:outline-none">
                                         <div className="max-w-xl">
                                            <h3 className="text-lg font-semibold mb-4">إضافة خصم جديد</h3>
                                            <DiscountForm patientId={patient.id} />
                                         </div>
                                    </Tab.Panel>

                                    {/* Invoices Panel */}
                                    <Tab.Panel className="focus:outline-none">
                                        <div className="flex items-center justify-between rounded-lg border p-4">
                                            <div>
                                                <h3 className="font-semibold text-slate-800">فاتورة شاملة</h3>
                                                <p className="text-sm text-slate-500">تحميل فاتورة بجميع الإجراءات والدفعات</p>
                                            </div>
                                            <DownloadInvoice patientId={patient.id} />
                                        </div>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </div>

                    {/* 3. Sidebar Panel (Right/Bottom) */}
                    <div className="lg:col-span-1 xl:col-span-1">
                        {showSideBar && toothNumber !== null ? (
                            <div className="sticky top-6 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 shadow-sm animate-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-100">
                                    <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                        تفاصيل سن {toothNumber}
                                    </h3>
                                    <button onClick={() => setShowSideBar(false)} className="text-indigo-400 hover:text-indigo-700">✕</button>
                                </div>
                                
                                {proceduresByToothNumber[toothNumber]?.length ? (
                                    <div className="space-y-3 mb-6">
                                        {proceduresByToothNumber[toothNumber].map((p, i) => (
                                             <div key={p.id} className="relative pl-4 border-l-2 border-indigo-200">
                                                <div className="text-sm font-semibold text-slate-800">{p.name}</div>
                                                <div className="text-xs text-slate-500">{new Date(p.processing_date).toLocaleDateString()}</div>
                                             </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-sm text-indigo-400 font-medium">
                                        لا توجد إجراءات مسجلة
                                    </div>
                                )}
                                
                                <Button 
                                    onClick={() => openFormProcedure(toothNumber)} 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> إدراج إجراء جديد
                                </Button>
                            </div>
                        ) : (
                             <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-400">
                                <Stethoscope className="mx-auto h-12 w-12 opacity-50 mb-2" />
                                <p className="text-sm">اضغط على أي سن في المخطط لعرض التفاصيل أو إضافة علاج.</p>
                             </div>
                        )}
                    </div>

                </div>

                {/* Procedure Modal Form */}
                {showProcedureForm && toothNumber !== null && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden ring-1 ring-slate-900/10">
                            <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50">
                                <h3 className="font-bold text-lg text-slate-800">إضافة إجراء طبي - سن {toothNumber}</h3>
                                <button onClick={() => setShowProcedureForm(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="p-6 max-h-[85vh] overflow-y-auto">
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
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function groupProceduresByToothNumber(procedures: Procedure[], teethById: Record<number, number>): Record<number, Procedure[]> {
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
