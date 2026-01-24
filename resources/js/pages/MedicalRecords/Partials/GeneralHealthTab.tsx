import { FormInput } from '@/components/FormInput';
import { FormTextArea } from '@/components/FormTextArea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Activity, AlertCircle, Baby, ClipboardList, Heart } from 'lucide-react';
import { HealthCheckItem } from './HealthCheckItem';

const generalHealthChecks = [
    { key: 'has_diabetes', label: 'السكري', icon: Activity },
    { key: 'has_hypertension', label: 'ضغط الدم', icon: Activity },
    { key: 'has_cardiovascular_disease', label: 'أمراض القلب', icon: Heart },
    { key: 'has_respiratory_disease', label: 'أمراض تنفسية', icon: Activity },
    { key: 'has_gastrointestinal_disease', label: 'أمراض هضمية', icon: Activity },
    { key: 'has_neural_disease', label: 'أمراض عصبية', icon: Activity },
    { key: 'has_hepatic_disease', label: 'أمراض الكبد', icon: Activity },
    { key: 'has_renal_disease', label: 'أمراض الكلى', icon: Activity },
    { key: 'has_endocrine_disease', label: 'الغدد الصماء', icon: Activity },
    { key: 'abnormal_bleeding_history', label: 'نزيف غير طبيعي', icon: AlertCircle },
    { key: 'hospitalized_or_operated', label: 'عمليات سابقة', icon: Activity },
] as const;

type HealthCheckKey = (typeof generalHealthChecks)[number]['key'];

interface GeneralHealthTabProps {
    data: {
        has_diabetes: boolean;
        has_hypertension: boolean;
        has_cardiovascular_disease: boolean;
        has_respiratory_disease: boolean;
        has_gastrointestinal_disease: boolean;
        has_neural_disease: boolean;
        has_hepatic_disease: boolean;
        has_renal_disease: boolean;
        has_endocrine_disease: boolean;
        abnormal_bleeding_history: boolean;
        hospitalized_or_operated: boolean;
        hospital_details: string;
        medical_disease_details: string;
        is_pregnant: boolean;
        pregnancy_trimester: string;
    };
    setData: <K extends keyof GeneralHealthTabProps['data']>(
        key: K,
        value: GeneralHealthTabProps['data'][K],
    ) => void;
    errors: Partial<Record<keyof GeneralHealthTabProps['data'], string>>;
}

export function GeneralHealthTab({
    data,
    setData,
    errors,
}: GeneralHealthTabProps) {
    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>الحالة الصحية العامة</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {generalHealthChecks.map((item) => (
                        <HealthCheckItem
                            key={item.key}
                            id={item.key}
                            label={item.label}
                            checked={Boolean(data[item.key as HealthCheckKey])}
                            onChange={(checked) =>
                                setData(item.key as HealthCheckKey, checked)
                            }
                            icon={item.icon}
                        />
                    ))}
                </div>

                <div className="mt-8 space-y-4">
                    {data.hospitalized_or_operated && (
                        <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
                            <FormInput
                                label=" تفاصيل العمليات/المستشفى"
                                name="hospital_details"
                                type="text"
                                value={String(data.hospital_details)}
                                onChange={(val) => setData('hospital_details', val)}
                                error={errors.hospital_details}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <FormTextArea
                            label="أي تفاصيل إضافية عن الحالة الصحية..."
                            name="medical_disease_details"
                            icon={ClipboardList}
                            value={data.medical_disease_details}
                            onChange={(val) => setData('medical_disease_details', val)}
                            error={errors.medical_disease_details}
                            rows={4}
                            className="min-h-20 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Pregnancy Section */}
                <div className="mt-6 rounded-lg border border-pink-100 bg-pink-50/30 p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <Checkbox
                            id="is_pregnant"
                            checked={data.is_pregnant}
                            onCheckedChange={(c) => setData('is_pregnant', Boolean(c))}
                            className="data-[state=checked]:border-pink-500 data-[state=checked]:bg-pink-500"
                        />
                        <Baby className="h-5 w-5 text-pink-500" />
                        <Label
                            htmlFor="is_pregnant"
                            className="font-medium text-pink-900"
                        >
                            مريضة حامل
                        </Label>
                    </div>

                    {data.is_pregnant && (
                        <div className="w-full max-w-xs">
                            <Label className="mb-1.5 block text-xs text-pink-700">
                                مرحلة الحمل
                            </Label>
                            <Select
                                value={data.pregnancy_trimester}
                                onValueChange={(val) =>
                                    setData('pregnancy_trimester', val)
                                }
                            >
                                <SelectTrigger className="border-pink-200 text-pink-800">
                                    <SelectValue placeholder="اختر المرحلة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="I">الثلث الأول (I)</SelectItem>
                                    <SelectItem value="II">الثلث الثاني (II)</SelectItem>
                                    <SelectItem value="III">الثلث الثالث (III)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
