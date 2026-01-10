import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState,useEffect } from 'react';
import { route } from 'ziggy-js';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const { props } = usePage<{
        flash: { success?: string; error?: string };
    }>();
     const [showToast, setShowToast] = useState(false);
        useEffect(() => {
            if (props.flash?.error) {
                setShowToast(true);
                const timer = setTimeout(() => setShowToast(false), 3000);
                return () => clearTimeout(timer);
            }
        }, [props.flash]);
        console.log(props.flash,'flash-welcome');

    const links = [
        { name: 'المستخدمون', href: '/users' },
        { name: 'المرضى', href: '/patients' },
        { name: 'الأطباء', href: '/doctors' },
        { name: 'المواعيد', href: '/appointments' },
        { name: 'الفواتير', href: '/invoices' },
        { name: 'الإجراءات', href: '/procedures' },
        { name: 'المدفوعات', href: '/payments' },
    ];
    return (
        <> {showToast && (
                <div className="animate-fade-in fixed top-4 right-4 z-50 rounded bg-green-500 px-4 py-2 text-white shadow-lg">
                    {props.flash?.success||props.flash?.error}
                </div>
            )}
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header dir='rtl' className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 bg-white shadow-sm dark:border-[#3E3E3A] dark:bg-[#1b1b18]">
                    <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                        {/* شعار الموقع */}
                        <Link
                            href={route('home')}
                            className="text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]"
                        >
                            🦷 DentalClinic
                        </Link>

                        {/* روابط الصفحات */}
                        <ul className="hidden gap-6 text-sm font-medium text-[#1b1b18] md:flex dark:text-[#EDEDEC]">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* روابط المستخدم */}
                        <div className="flex items-center gap-4">
                            {auth?.user ? (
                                <>
                                    <Link
                                        href="/today"
                                        className="rounded-md border border-[#19140035] px-4 py-1.5 hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                    >
                                         جدول العمل
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="rounded-md border border-transparent px-4 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-[#2d2d2b]"
                                    >
                                        تسجيل الخروج
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-1.5 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        تسجيل الدخول
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="rounded-md border border-[#19140035] px-4 py-1.5 hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                    >
                                        إنشاء حساب
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>
            </div>
        </>
    );
}
