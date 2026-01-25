import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
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
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { route } from 'ziggy-js';

import DentalChartCard from './Partials/DentalChartCard';
import PatientDataTabs from './Partials/PatientDataTabs';
import PatientHeader from './Partials/PatientHeader';
import ProcedureModal from './Partials/ProcedureModal';
import ToothDetailsSidebar from './Partials/ToothDetailsSidebar';

interface PagePropsPatient extends PageProps {
    services_category: ServiceCategory[];
    patientDetails: patientDetails;
}

export default function Show() {
    const { services_category, patientDetails: initialPatientDetails,flash } =
        usePage<PagePropsPatient>().props;

    const [patient, setPatient] = useState(initialPatientDetails);

    // UI States
    const [selectedTooth, setSelectedTooth] = useState<number>(1);
    const [showProcedureForm, setShowProcedureForm] = useState(false);
    const [showSideBar, setShowSideBar] = useState(false);
    const { success } = useAppToast();

    // --- Memos & Helpers ---
    const teethMap = useMemo(() => {
        const map = new Map<number, number>();
        patient?.teeth?.forEach((tooth: Tooth) => {
            map.set(Number(tooth.id), Number(tooth.tooth_number));
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

    const getLastProcedure = useCallback((toothNumber: number): Procedure | null => {
        const list = proceduresByToothNumber[toothNumber];
        if (!list?.length) return null;
        return list[list.length - 1];
    }, [proceduresByToothNumber]);

    const getToothClasses = useCallback((toothNumber: number): string => {
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
    }, [proceduresByToothNumber]);

    const columnsProcedures: ColumnDef<Procedure>[] = useMemo(() => [
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
    ], [teethMap]);

    const breadcrumbs: BreadcrumbItem[] = useMemo(() => [
        { title: 'المرضى', href: route('patients.index') },
        { title: 'ملف المريض', href: route('patients.details', patient?.id) },
    ], [patient?.id, patient?.name]);

    const getToothIdByNumber = useCallback((toothNumber: number): number => {
        const tooth = patient.teeth.find(
            (t) => String(t.tooth_number) === String(toothNumber),
        );
        return (Number(tooth?.id)) ?? 0;
    }, [patient.teeth]);

    const addProcedureOptimistic = useCallback((procedure: Procedure) => {
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
    }, [success, teethMap]);

    const handleToothSelect = useCallback((toothNumber: number) => {
        setSelectedTooth(toothNumber);
        setShowSideBar(true);
    }, []);

    const handleOpenProcedureForm = useCallback((toothNumber: number) => {
        setSelectedTooth(toothNumber);
        setShowProcedureForm(true);
        setShowSideBar(false);
    }, []);

    const handleCloseSidebar = useCallback(() => {
        setShowSideBar(false);
    }, []);

    const handleCloseProcedureForm = useCallback(() => {
        setShowProcedureForm(false);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`ملف المريض : ${patient?.name}`} />

            <div className="flex flex-col gap-6 p-4 font-sans">
                <PatientHeader patient={patient} />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    <div className="flex flex-col gap-6 lg:col-span-2 xl:col-span-3">
                        <DentalChartCard
                            teeth={patient.teeth}
                            getToothClasses={getToothClasses}
                            getLastProcedure={getLastProcedure}
                            onToothSelect={handleToothSelect}
                        />
                        <PatientDataTabs
                            patient={patient}
                            columnsProcedures={columnsProcedures}
                        />
                    </div>

                    <div className="lg:col-span-1 xl:col-span-1">
                        <ToothDetailsSidebar
                            showSideBar={showSideBar}
                            toothNumber={selectedTooth}
                            procedures={proceduresByToothNumber[selectedTooth] || []}
                            onClose={handleCloseSidebar}
                            onOpenProcedureForm={handleOpenProcedureForm}
                        />
                    </div>
                </div>

                <ProcedureModal
                    showProcedureForm={showProcedureForm}
                    toothNumber={selectedTooth}
                    toothId={getToothIdByNumber(selectedTooth)}
                    services_category={services_category}
                    patient={patient}
                    onClose={handleCloseProcedureForm}
                    onCreated={addProcedureOptimistic}
                />
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
