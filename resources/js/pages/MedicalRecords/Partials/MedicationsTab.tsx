import { FormInput } from '@/components/FormInput';
import { FormTextArea } from '@/components/FormTextArea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ClipboardList } from 'lucide-react';

interface MedicationsTabProps {
    data: {
        allergic_to: string;
        current_medications: string;
        clinical_notes: string;
    };
    setData: <K extends keyof MedicationsTabProps['data']>(
        key: K,
        value: MedicationsTabProps['data'][K],
    ) => void;
    errors: Partial<Record<keyof MedicationsTabProps['data'], string>>;
}

export function MedicationsTab({
    data,
    setData,
    errors,
}: MedicationsTabProps) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="mb-2 block">الأدوية والملاحظات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <FormTextArea
                        label="حساسية (Allergies)"
                        name="allergic_to"
                        icon={ClipboardList}
                        value={data.allergic_to}
                        onChange={(val) => setData('allergic_to', val)}
                        error={errors.allergic_to}
                        rows={4}
                        className="min-h-20 w-full rounded-md border border-slate-200 bg-white  text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <FormTextArea
                        label="الأدوية الحالية (Current Medications)"
                        name="current_medications"
                        icon={ClipboardList}
                        value={data.current_medications}
                        onChange={(val) => setData('current_medications', val)}
                        error={errors.current_medications}
                        rows={4}
                        className="min-h-20 w-full rounded-md border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                </div>
                <Separator />
                <div className="space-y-2">
                    <FormTextArea
                        label="    ملاحظات سريرية (Clinical Notes) "
                        name="clinical_notes"
                        icon={ClipboardList}
                        value={data.clinical_notes}
                        onChange={(val) => setData('clinical_notes', val)}
                        error={errors.clinical_notes}
                        rows={4}
                        className="min-h-20 w-full rounded-md border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
