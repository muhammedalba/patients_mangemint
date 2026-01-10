// Components
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="تأكيد البريد الإلكتروني"
            description="قم بتأكيد البريد الإلكتروني بالضغط على الرابط ضمن البريد الذي وصلك للتو"
        >
            <Head title="تأكيد البريد الإلكتروني" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    رابط تحقق جديد أُرسل إلى البريد الإلكتروني الذي أضفتهُ أثناء تسجيل الحساب
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
أعدْ إرسال بريد تأكيد
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
تسجيل خروج                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
