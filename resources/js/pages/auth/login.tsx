import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    return (
        <AuthLayout
            title="أهلاً بك في مركز زيركون"
            description="سجّلْ معلومات حسابك أدناه"
        >
            <Head title="تسجيل الدخول" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="space-y-6" dir='rtl'
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    البريد الإلكتروني
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        كلمة المرور
                                    </Label>

                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="password"
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-gray-700"
                                    >
                                        تذكّرني
                                    </Label>
                                </div>
                                <div>
                                    <TextLink
                                        href={request()}
                                        className="text-sm text-blue-600 hover:underline"
                                        tabIndex={5}
                                    >
                                        نسيت كلمة المرور؟
                                    </TextLink>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-md bg-blue-600 py-2 text-white transition duration-200 hover:bg-blue-700"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                تسجيل دخول
                            </Button>
                        </div>

                        <div className="text-center text-sm text-gray-600">
ليس لديك حساب؟                            <TextLink
                                href={register()}
                                tabIndex={5}
                                className="text-blue-600 hover:underline"
                            >
                                أنشئ حساب جديد
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
