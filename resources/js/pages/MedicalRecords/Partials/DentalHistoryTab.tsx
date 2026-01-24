import { FormTextArea } from '@/components/FormTextArea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ClipboardList } from 'lucide-react';

interface DentalHistoryTabProps {
    data: {
        chief_complaint: string | string[];
        present_illness_history: string;
        past_dental_history: string;
    };
    setData: <K extends keyof DentalHistoryTabProps['data']>(
        key: K,
        value: DentalHistoryTabProps['data'][K],
    ) => void;
    errors: Partial<Record<keyof DentalHistoryTabProps['data'], string>>;
}

export function DentalHistoryTab({
    data,
    setData,
    errors,
}: DentalHistoryTabProps) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>الشكوى والتاريخ السني</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 border-none">
                <FormTextArea
                    label="الشكوى الرئيسية (Chief Complaint)"
                    name="chief_complaint"
                    icon={ClipboardList}
                    value={data.chief_complaint.toString()}
                    onChange={(val) => setData('chief_complaint', val)}
                    error={errors.chief_complaint}
                    rows={4}
                    className="min-h-20 w-full rounded-md border border-slate-200 bg-white  text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <Separator />
                
                    <FormTextArea
                        label="تاريخ المرض الحالي"
                        name="present_illness_history"
                        icon={ClipboardList}
                        value={data.present_illness_history}
                        onChange={(val) => setData('present_illness_history', val)}
                        error={errors.present_illness_history}
                        rows={4}
                        className="min-h-20 w-full rounded-md border border-slate-200 bg-white  text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
              
                
                    <FormTextArea
                        label="التاريخ السني السابق (Past Dental History)"
                        name="past_dental_history"
                        icon={ClipboardList}
                        value={data.past_dental_history}
                        onChange={(val) => setData('past_dental_history', val)}
                        error={errors.past_dental_history}
                        rows={4}
                        className="min-h-20 w-full rounded-md border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                
            </CardContent>
        </Card>
    );
}
