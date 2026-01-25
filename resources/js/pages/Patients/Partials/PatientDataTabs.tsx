import DiscountForm from '@/components/DiscountForm';
import DownloadInvoice from '@/components/DownloadInvoice';
import { DynamicTable } from '@/components/DynamicTable';
import FinancialSummaryForm from '@/components/FinancialSummary';
import { cn } from '@/lib/utils';
import { patientDetails, Procedure } from '@/types';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import { Activity, Percent, Receipt, Wallet } from 'lucide-react';
import React, { Fragment } from 'react';

interface PatientDataTabsProps {
    patient: patientDetails;
    columnsProcedures: ColumnDef<Procedure>[];
}

const PatientDataTabs: React.FC<PatientDataTabsProps> = ({
    patient,
    columnsProcedures,
}) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <TabGroup>
                <div className="border-b border-slate-100 bg-slate-50/50 px-4">
                    <TabList className="flex gap-4">
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
                    </TabList>
                </div>

                <TabPanels className="p-6">
                    {/* Procedures Panel */}
                    <TabPanel className="focus:outline-none">
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
                    </TabPanel>

                    {/* Financial Panel */}
                    <TabPanel className="focus:outline-none">
                        <FinancialSummaryForm
                            summary={patient.financial_summary}
                        />
                    </TabPanel>

                    {/* Discounts Panel */}
                    <TabPanel className="focus:outline-none">
                        <div className="max-w-xl">
                            <h3 className="mb-4 text-lg font-semibold">
                                إضافة خصم جديد
                            </h3>
                            <DiscountForm
                                patientId={patient.id}
                            />
                        </div>
                    </TabPanel>

                    {/* Invoices Panel */}
                    <TabPanel className="focus:outline-none">
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
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default PatientDataTabs;
