import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { Mail, Lock, LogIn } from 'lucide-react';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    return (
        <AuthSplitLayout
            title="أهلاً بك مجدداً"
            description="سجّل الدخول للوصول إلى لوحة تحكم مركز زيركون"
        >
            <Head title="تسجيل الدخول" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="space-y-6" dir='rtl'
            > 
                {({ processing, errors }) => (
                    <div className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-slate-700 mr-1"
                                >
                                    البريد الإلكتروني
                                </Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-colors group-focus-within:text-teal-600 text-slate-400">
                                        <Mail className="size-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="name@example.com"
                                        className="w-full rounded-xl border border-slate-200 bg-white pr-11 py-6 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between mr-1">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-semibold text-slate-700"
                                    >
                                        كلمة المرور
                                    </Label>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-colors group-focus-within:text-teal-600 text-slate-400">
                                        <Lock className="size-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-slate-200 bg-white pr-11 py-6 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 shadow-sm"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm font-medium text-slate-600 cursor-pointer select-none"
                                    >
                                        تذكّرني
                                    </Label>
                                </div>
                                <TextLink
                                    href={request()}
                                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                                    tabIndex={5}
                                >
                                    نسيت كلمة المرور؟
                                </TextLink>
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-xl bg-teal-600 py-7 text-lg font-bold text-white shadow-xl shadow-teal-100 transition-all hover:bg-teal-700 hover:shadow-teal-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing ? <Spinner className="size-5" /> : <LogIn className="size-5" />}
                                تسجيل دخول
                            </Button>
                        </div>

                        <div className="text-center text-sm font-medium text-slate-500 pt-2">
                            ليس لديك حساب؟{' '}
                            <TextLink
                                href={register()}
                                tabIndex={5}
                                className="text-teal-600 hover:text-teal-700 font-bold"
                            >
                                أنشئ حساباً جديداً
                            </TextLink>
                        </div>
                    </div>
                )}
            </Form>

            {status && (
                <div className="mt-4 p-4 rounded-xl bg-teal-50 border border-teal-100 text-center text-sm font-semibold text-teal-700 animate-in fade-in slide-in-from-top-2">
                    {status}
                </div>
            )}
        </AuthSplitLayout>
    );
}
