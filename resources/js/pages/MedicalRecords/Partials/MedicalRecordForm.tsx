import { MedicalRecord, Patient, User } from '@/types';
import { Tab } from '@headlessui/react';
import { Link, useForm } from '@inertiajs/react';
import { Fragment, useEffect, useState } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    Activity, 
    AlertCircle, 
    FileText, 
    Heart, 
    Image as ImageIcon, 
    Pill, 
    Save, 
    Stethoscope, 
    User as UserIcon,
    Paperclip,
    X,
    Check,
    Baby
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Props {
    patients: Patient[];
    doctors: User[];
    medicalRecord?: MedicalRecord;
    submitLabel?: string;
}

export default function MedicalRecordForm({
    patients,
    doctors,
    medicalRecord,
    submitLabel = 'حفظ السجل',
}: Props) {
    const { data, setData, post, errors, processing } = useForm({
        _method: medicalRecord ? 'PUT' : 'POST',
        patient_id: medicalRecord?.patient_id || '',
        doctor_id: medicalRecord?.doctor_id || '',
        attachments: [],
        images: [],
        deleted_attachments: [],
        deleted_images: [],
        chief_complaint: medicalRecord?.chief_complaint || '',
        present_illness_history: medicalRecord?.present_illness_history || '',
        past_dental_history: medicalRecord?.past_dental_history || '',
        has_cardiovascular_disease: medicalRecord?.has_cardiovascular_disease || false,
        has_hypertension: medicalRecord?.has_hypertension || false,
        has_respiratory_disease: medicalRecord?.has_respiratory_disease || false,
        has_gastrointestinal_disease: medicalRecord?.has_gastrointestinal_disease || false,
        has_neural_disease: medicalRecord?.has_neural_disease || false,
        has_hepatic_disease: medicalRecord?.has_hepatic_disease || false,
        has_renal_disease: medicalRecord?.has_renal_disease || false,
        has_endocrine_disease: medicalRecord?.has_endocrine_disease || false,
        has_diabetes: medicalRecord?.has_diabetes || false,
        medical_disease_details: medicalRecord?.medical_disease_details || '',
        allergic_to: medicalRecord?.allergic_to || '',
        current_medications: medicalRecord?.current_medications || '',
        hospitalized_or_operated: medicalRecord?.hospitalized_or_operated || false,
        hospital_details: medicalRecord?.hospital_details || '',
        abnormal_bleeding_history: medicalRecord?.abnormal_bleeding_history || false,
        is_pregnant: medicalRecord?.is_pregnant || false,
        pregnancy_trimester: medicalRecord?.pregnancy_trimester || '',
        clinical_notes: medicalRecord?.clinical_notes || '',
    });

    const [existingAttachments, setExistingAttachments] = useState(medicalRecord?.attachments || []);
    const [existingImages, setExistingImages] = useState(medicalRecord?.images || []);

    const selectedPatient = patients.find((p) => String(p.id) === String(data.patient_id));

    useEffect(() => {
        if (!medicalRecord && patients.length === 1) {
            setData('patient_id', patients[0].id);
        }
    }, [patients]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = medicalRecord
            ? route('medical-records.update', medicalRecord.id)
            : route('medical-records.store');
        post(url, {
            forceFormData: true,
        });
    }

    const handleDeleteAttachment = (attachment: string) => {
        setData('deleted_attachments', [...data.deleted_attachments, attachment]);
        setExistingAttachments((prev) => prev.filter((att) => att !== attachment));
    };

    const handleDeleteImage = (image: string) => {
        setData('deleted_images', [...data.deleted_images, image]);
        setExistingImages((prev) => prev.filter((img) => img !== image));
    };

    // --- Configurations ---
    const tabs = [
        { name: 'التاريخ السني', icon: Stethoscope, id: 'dental' },
        { name: 'الصحة العامة', icon: Heart, id: 'health' },
        { name: 'أدوية وحساسية', icon: Pill, id: 'meds' },
        { name: 'ملاحظات وملفات', icon: FileText, id: 'files' },
    ];

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
    ];

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-6xl gap-6 font-sans">
            
            {/* Header / Meta Info */}
            <Card className="mb-6 border-slate-200 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                        <UserIcon className="h-5 w-5 text-teal-600" />
                        بيانات الملف الأساسية
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="patient_id">المريض</Label>
                            <Input 
                                id="patient_id"
                                value={selectedPatient ? selectedPatient.name : 'يرجى تحديد المريض من القائمة الرئيسية'}
                                readOnly
                                className="bg-slate-50 font-medium text-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doctor_id">الطبيب المعالج</Label>
                            <Select 
                                value={String(data.doctor_id)} 
                                onValueChange={(val) => setData('doctor_id', val)}
                            >
                                <SelectTrigger className={cn(errors.doctor_id ? "border-red-500" : "")}>
                                    <SelectValue placeholder="اختر الطبيب" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((d) => (
                                        <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.doctor_id && <p className="text-sm text-red-500">{errors.doctor_id}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tab.Group>
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    
                    {/* Sidebar Tabs (Vertical on Desktop, Horizontal Scroll on Mobile) */}
                    <Tab.List className="flex w-full shrink-0 flex-row gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200 md:w-64 md:flex-col">
                        {tabs.map((tab) => (
                            <Tab as={Fragment} key={tab.name}>
                                {({ selected }) => (
                                    <button
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all outline-none",
                                            selected
                                                ? "bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-200"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <tab.icon className={cn("h-5 w-5", selected ? "text-teal-600" : "text-slate-400")} />
                                        <span className="whitespace-nowrap">{tab.name}</span>
                                        {selected && <div className="mr-auto h-2 w-2 rounded-full bg-teal-500 md:block hidden" />}
                                    </button>
                                )}
                            </Tab>
                        ))}
                    </Tab.List>

                    {/* Panels */}
                    <Tab.Panels className="flex-1">
                        
                        {/* 1. Dental History */}
                        <Tab.Panel className="space-y-6 focus:outline-none">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle>الشكوى والتاريخ السني</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="chief_complaint" className="text-teal-800">الشكوى الرئيسية (Chief Complaint)</Label>
                                        <textarea
                                            id="chief_complaint"
                                            value={data.chief_complaint}
                                            onChange={(e) => setData('chief_complaint', e.target.value)}
                                            className="min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                            placeholder="ألم شديد في الجهة اليمنى، حساسية، إلخ..."
                                        />
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label htmlFor="present_illness">تاريخ المرض الحالي</Label>
                                        <textarea
                                            id="present_illness"
                                            value={data.present_illness_history}
                                            onChange={(e) => setData('present_illness_history', e.target.value)}
                                            className="min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="past_dental">التاريخ السني السابق</Label>
                                        <textarea
                                            id="past_dental"
                                            value={data.past_dental_history}
                                            onChange={(e) => setData('past_dental_history', e.target.value)}
                                            className="min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            placeholder="علاجات سابقة، قلع، تقويم..."
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </Tab.Panel>

                        {/* 2. General Health */}
                        <Tab.Panel className="space-y-6 focus:outline-none">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle>الحالة الصحية العامة</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {generalHealthChecks.map((item) => (
                                            <div key={item.key} className={cn(
                                                "flex items-center gap-3 rounded-lg border p-4 transition-all",
                                                (data as any)[item.key] ? "border-teal-200 bg-teal-50/50" : "border-slate-200 bg-white hover:bg-slate-50"
                                            )}>
                                                <Checkbox 
                                                    id={item.key}
                                                    checked={(data as any)[item.key]}
                                                    onCheckedChange={(checked) => setData(item.key as any, checked)}
                                                    className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <item.icon className={cn("h-4 w-4", (data as any)[item.key] ? "text-teal-600" : "text-slate-400")} />
                                                    <Label htmlFor={item.key} className="cursor-pointer font-medium text-slate-700">
                                                        {item.label}
                                                    </Label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-8 space-y-4">
                                        {(data.hospitalized_or_operated) && (
                                            <div className="rounded-lg bg-orange-50 p-4 border border-orange-100">
                                                <Label htmlFor="hospital_details" className="text-orange-800 mb-2 block">تفاصيل العمليات/المستشفى</Label>
                                                <Input 
                                                    value={data.hospital_details}
                                                    onChange={(e) => setData('hospital_details', e.target.value)}
                                                    className="bg-white"
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="space-y-2">
                                            <Label>تفاصيل طبية أخرى</Label>
                                            <textarea
                                                value={data.medical_disease_details}
                                                onChange={(e) => setData('medical_disease_details', e.target.value)}
                                                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                placeholder="أي تفاصيل إضافية عن الحالة الصحية..."
                                            />
                                        </div>
                                    </div>

                                    {/* Pregnancy Section */}
                                    <div className="mt-6 rounded-lg border border-pink-100 bg-pink-50/30 p-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Checkbox 
                                                id="is_pregnant"
                                                checked={data.is_pregnant}
                                                onCheckedChange={(c) => setData('is_pregnant', c)}
                                                className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                                            />
                                            <Baby className="h-5 w-5 text-pink-500" />
                                            <Label htmlFor="is_pregnant" className="text-pink-900 font-medium">مريضة حامل</Label>
                                        </div>
                                        
                                        {data.is_pregnant && (
                                            <div className="w-full max-w-xs">
                                                <Label className="text-xs text-pink-700 mb-1.5 block">مرحلة الحمل</Label>
                                                <Select
                                                     value={data.pregnancy_trimester}
                                                     onValueChange={(val) => setData('pregnancy_trimester', val)}
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
                        </Tab.Panel>

                        {/* 3. Meds & Clinical Notes */}
                        <Tab.Panel className="space-y-6 focus:outline-none">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader><CardTitle>الأدوية والملاحظات</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-rose-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            حساسية (Allergies)
                                        </Label>
                                        <Input 
                                            value={data.allergic_to}
                                            onChange={(e) => setData('allergic_to', e.target.value)}
                                            className="border-rose-100 bg-rose-50/50 focus:border-rose-300 focus:ring-rose-200"
                                            placeholder="بنسلين، مخدر موضعي، لاتكس..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>الأدوية الحالية</Label>
                                        <textarea
                                            value={data.current_medications}
                                            onChange={(e) => setData('current_medications', e.target.value)}
                                            className="min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-slate-500" />
                                            ملاحظات سريرية (Clinical Notes)
                                        </Label>
                                        <textarea
                                            value={data.clinical_notes}
                                            onChange={(e) => setData('clinical_notes', e.target.value)}
                                            className="min-h-[150px] w-full rounded-md border border-slate-200 bg-amber-50/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </Tab.Panel>
                        
                        {/* 4. Files */}
                        <Tab.Panel className="space-y-6 focus:outline-none">
                            <Card className="border-slate-200 shadow-sm">
                                <CardHeader><CardTitle>المرفقات والوسائط</CardTitle></CardHeader>
                                <CardContent className="space-y-8">
                                    {/* Images */}
                                    <div className="space-y-4">
                                        <Label className="flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4" />
                                            صور الأشعة والحالة
                                        </Label>
                                        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition-colors hover:bg-slate-100">
                                            <Input 
                                                type="file" 
                                                multiple 
                                                accept="image/*"
                                                className="hidden" 
                                                id="image-upload"
                                                onChange={(e) => setData('images' as any, Array.from(e.target.files || []) as never[])}
                                            />
                                            <Label htmlFor="image-upload" className="cursor-pointer block">
                                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                                    <div className="rounded-full bg-white p-2 shadow-sm">
                                                        <ImageIcon className="h-6 w-6 text-teal-600" />
                                                    </div>
                                                    <span className="text-sm">اضغط لرفع صور (JPG, PNG)</span>
                                                </div>
                                            </Label>
                                        </div>
                                        
                                        {/* Existing Images Gallery */}
                                        {(existingImages.length > 0 || data.images.length > 0) && (
                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                                {existingImages.map((img) => (
                                                    <div key={img} className="group relative aspect-square overflow-hidden rounded-lg bg-black/5">
                                                        <img src={`/storage/${img}`} className="h-full w-full object-cover" />
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleDeleteImage(img)}
                                                            className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {/* Preview newly added images if we had URL.createObjectURL logic, skipping for brevity */}
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Attachments */}
                                    <div className="space-y-4">
                                        <Label className="flex items-center gap-2">
                                            <Paperclip className="h-4 w-4" />
                                            مستندات أخرى
                                        </Label>
                                        <Input 
                                            type="file" 
                                            multiple 
                                            onChange={(e) => setData('attachments' as any, Array.from(e.target.files || []) as never[])}
                                            className="w-full"
                                        />
                                        
                                        {existingAttachments.length > 0 && (
                                            <div className="flex flex-col gap-2">
                                                 {existingAttachments.map((file) => (
                                                    <div key={file} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <FileText className="h-4 w-4 text-slate-400" />
                                                            <a href={`/storage/${file}`} target="_blank" className="text-blue-600 hover:underline truncate max-w-[200px]">{file.split('/').pop()}</a>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleDeleteAttachment(file)}
                                                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                 ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Tab.Panel>
                    </Tab.Panels>
                 </div>
            </Tab.Group>

            {/* Footer Actions */}
            <div className="mt-8 flex items-center justify-end gap-3 sticky bottom-4 z-50 rounded-lg bg-white/80 p-4 shadow-lg ring-1 ring-slate-900/5 backdrop-blur">
                <Link href={route('medical-records.index')}>
                    <Button variant="ghost" type="button">إلغاء</Button>
                </Link>
                <Button 
                    disabled={processing} 
                    className="bg-teal-600 hover:bg-teal-700 min-w-[120px] gap-2"
                >
                    {processing ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
