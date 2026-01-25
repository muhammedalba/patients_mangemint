import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import registerBg from '../../../images/register-bg.png';
import { User, Mail, Lock, CheckCircle, UserPlus } from 'lucide-react';

export default function Register() {
    return (
        <AuthSplitLayout
            title="انضم إلى مركز زيركون"
            description="أنشئ حسابك الجديد للبدء في إدارة ملفاتك الطبية"
            backgroundImage={registerBg}
        >
            <Head title="تسجيل حساب جديد" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-5" dir='rtl'
            >
                {({ processing, errors }) => (
                    <div className="space-y-5">
                        <div className="space-y-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 mr-1">الاسم الكامل</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-colors group-focus-within:text-teal-600 text-slate-400">
                                        <User className="size-5" />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Full Name"
                                        className="w-full rounded-xl border border-slate-200 bg-white pr-11 py-6 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-slate-700 mr-1">البريد الإلكتروني</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-colors group-focus-within:text-teal-600 text-slate-400">
                                        <Mail className="size-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className="w-full rounded-xl border border-slate-200 bg-white pr-11 py-6 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 mr-1">كلمة المرور</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-colors group-focus-within:text-teal-600 text-slate-400">
                                        <Lock className="size-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-slate-200 bg-white pr-11 py-6 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-semibold text-slate-700 mr-1">
                                    تأكيد كلمة المرور
                                </Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-colors group-focus-within:text-teal-600 text-slate-400">
                                        <CheckCircle className="size-5" />
                                    </div>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-slate-200 bg-white pr-11 py-6 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-xl bg-teal-600 py-7 text-lg font-bold text-white shadow-xl shadow-teal-100 transition-all hover:bg-teal-700 hover:shadow-teal-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                                tabIndex={5}
                            >
                                {processing ? <Spinner className="size-5" /> : <UserPlus className="size-5" />}
                                إنشاء حساب جديد
                            </Button>
                        </div>

                        <div className="text-center text-sm font-medium text-slate-500 pt-2">
                            لديك حساب بالفعل؟{' '}
                            <TextLink 
                                href={login()} 
                                tabIndex={6}
                                className="text-teal-600 hover:text-teal-700 font-bold"
                            >
                                سجل دخول الآن
                            </TextLink>
                        </div>
                    </div>
                )}
            </Form>
        </AuthSplitLayout>
    );
}
