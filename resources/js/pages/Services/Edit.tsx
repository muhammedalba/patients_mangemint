import { FormButton } from '@/components/FormButton';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { FormTextArea } from '@/components/FormTextArea';
import AppLayout from '@/layouts/app-layout';
import { Service, ServiceCategory, type BreadcrumbItem } from '@/types';
import { useAppToast } from '@/utils/toast';
import { Head, Link, useForm } from '@inertiajs/react';
import { ClipboardList, CreditCard, Layers, Smile, Wallet } from 'lucide-react';
import { FormEvent } from 'react';
import { route } from 'ziggy-js';

export default function EditService({
    service,
    categories,
}: {
    service: Service;
    categories: ServiceCategory[];
}) {
    const { data, setData, patch, processing, errors } = useForm<{
        name: string;
        description: string;
        price: string;
        category_id: string;
    }>({
        name: service.name || '',
        description: service.description || '',
        price: String(service.price ?? ''),
        category_id: service.category_id || '',
    });
    const { success, error, warning } = useAppToast();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!data.name || !data.price || !data.category_id) {
            warning('يرجى إدخال جميع البيانات');
            return;
        }
        patch(route('services.update', service.id), {
            onSuccess: () => {
                success('تم تعديل الخدمة الطبية بنجاح');
            },
            onError: () => {
                error(
                    'فشل تعديل الخدمة الطبية',
                    'يرجى التحقق من البيانات المدخلة',
                );
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Services', href: route('services.index') },
        {
            title: `Update: ${service.name}`,
            href: route('services.edit', service.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title=" تعديل الخدمة الطبية" />
            <div className="mx-auto mt-6 max-w-5xl">
                <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-800">
                                تعديل الخدمة الطبية:
                            </h1>
                            <p className="text-sm text-slate-500">
                                تعديل خدمة طبية ضمن النظام
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
                                name="category_id"
                                label="اسم فئة الخدمة الطبية"
                                value={data.category_id}
                                onChange={(val) => {
                                    if (Array.isArray(val)) return;
                                    setData('category_id', val);
                                }}
                                icon={Layers}
                                options={categories.map(
                                    (category: ServiceCategory) => ({
                                        value: String(category.id),
                                        label: category.name,
                                    }),
                                )}
                            />
                            <FormInput
                                label="اسم الخدمة الطبية"
                                name="name"
                                type="text"
                                value={data.name}
                                icon={Smile}
                                onChange={(val) => setData('name', val)}
                                placeholder="اسم الخدمة"
                                error={errors.name}
                            />

                            <FormInput
                                label="التكلفة"
                                type="number"
                                name="price"
                                value={data.price}
                                onChange={(val: string) =>
                                    setData('price', val)
                                }
                                placeholder="تكلفة الخدمة"
                                icon={CreditCard}
                                error={errors.price}
                            />

                            <FormTextArea
                                label="وصف الخدمة"
                                name="description"
                                icon={ClipboardList}
                                value={data.description}
                                onChange={(val: string) =>
                                    setData('description', val)
                                }
                                error={errors.description}
                                rows={2}
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
                                label="تحديث"
                                loadingLabel="جارِ التحديث ..."
                            />
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
