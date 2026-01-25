import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Service } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { DollarSign, FileText, Layers, Smile, Wallet } from 'lucide-react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function CreateService() {
    const { categories } = usePage<{
        categories: Service[];
    }>().props;

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        description: string;
        price: string;
        category_id: string;
    }>({
        name: '',
        description: '',
        price: '',
        category_id: '',
    });
    const { success, error, warning } = useAppToast();
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // validate data
        if (!data.name) {
            warning('يرجى إدخال اسم الخدمة');
            errors.name = 'يرجى إدخال اسم الخدمة';
            return;
        }

        if (!data.price) {
            warning('يرجى إدخال سعر الخدمة');
            errors.price = 'يرجى إدخال سعر الخدمة';
            return;
        }
        if (!data.category_id) {
            warning('يرجى إدخال فئة الخدمة');
            errors.category_id = 'يرجى إدخال فئة الخدمة';
            return;
        }
        post(route('services.store'), {
            onSuccess: () => {
                success(
                    'تم حفظ الخدمة الطبية بنجاح',
                    'تمت إضافة الخدمة إلى جدول الخدمات الطبية',
                );
            },
            onError: () => {
                error(
                    'فشل حفظ الخدمة الطبية',
                    'يرجى التحقق من البيانات المدخلة',
                );
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الخدمات الطبية', href: route('services.index') },
        { title: 'إضافة خدمة طبية', href: route('services.create') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة خدمة طبية" />
            <div className="mx-auto mt-6 max-w-5xl">
                <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-800">
                                إضافة خدمة طبية
                            </h1>
                            <p className="text-sm text-slate-500">
                                تسجيل خدمة طبية ضمن النظام
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8 px-6 py-6"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormSelect
                                label="الفئة"
                                name="category_id"
                                value={data.category_id}
                                onChange={(val) => {
                                    if (Array.isArray(val)) return;
                                    setData('category_id', val);
                                }}
                                options={[
                                    ...(categories.map((category) => ({
                                        value: String(category.id),
                                        label: category.name,
                                    })) ?? []),
                                ]}
                                icon={Layers}
                                error={errors.category_id}
                            />
                            <FormInput
                                label="اسم الخدمة"
                                type="text"
                                name="name"
                                value={data.name ?? ''}
                                onChange={(val: string) => setData('name', val)}
                                icon={Smile}
                                error={errors.name}
                            />

                            <FormInput
                                type="number"
                                name="price"
                                value={data.price}
                                onChange={(val: string) =>
                                    setData('price', val)
                                }
                                label="تكلفة الخدمة"
                                icon={DollarSign}
                                error={errors.price}
                            />

                            <FormInput
                            type="textarea"
                            name="description"
                            value={data.description}
                            onChange={(val: string) =>
                                setData('description', val)
                            }
                            label="وصف الخدمة"
                            icon={FileText}
                            error={errors.description}
                        />


                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                            <Link
                                href={route('services.index')}
                                className="rounded-xl border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                إنهاء
                            </Link>

                            <FormButton
                            processing={processing}
                            label="حفظ"
                            loadingLabel="جارِ الحفظ ..."
                        />
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
