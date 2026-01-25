import bgImage from '../../../images/auth-bg.png';
import AppLogoIcon from '@/components/app-logo-icon';
import FloatingSupportButton from '@/components/floating-support-button';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
    backgroundImage?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
    backgroundImage,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props as any;

    return (
        <div className="relative grid min-h-svh flex-col lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r overflow-hidden">
                {/* Background Image with Overlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-110" 
                    style={{ backgroundImage: `url("${backgroundImage || bgImage}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-slate-900/70 to-zinc-900/90" />
                
                <Link
                    href={home()}
                    className="relative z-20 flex items-center text-lg font-bold tracking-tight"
                >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 backdrop-blur-sm border border-teal-500/30">
                        <AppLogoIcon className="size-6 fill-teal-400" />
                    </div>
                    <span className="text-2xl font-black text-white">{name || 'مركز زيركون'}</span>
                </Link>

                {quote && (
                    <div className="relative z-20 mt-auto">
                        <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-md border border-white/10 shadow-2xl">
                            <blockquote className="space-y-4">
                                <p className="text-xl italic font-medium leading-relaxed text-slate-100 italic">
                                    &ldquo;{quote.message}&rdquo;
                                </p>
                                <footer className="flex items-center gap-3">
                                    <div className="h-0.5 w-8 bg-teal-500/50" />
                                    <span className="text-sm font-semibold tracking-wider uppercase text-teal-400">
                                        {quote.author}
                                    </span>
                                </footer>
                            </blockquote>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="w-full lg:p-8 bg-slate-50/50 flex flex-col items-center justify-center py-12 px-6 sm:px-0">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[380px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden mb-4"
                    >
                        <div className="flex flex-col items-center gap-2">
                             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 shadow-lg shadow-teal-200">
                                <AppLogoIcon className="size-8 fill-white" />
                            </div>
                            <span className="text-xl font-black text-slate-900">{name || 'مركز زيركون'}</span>
                        </div>
                    </Link>
                    
                    <div className="flex flex-col items-center gap-3 text-center">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
                        <p className="text-base text-slate-500 max-w-[90%] mx-auto">
                            {description}
                        </p>
                    </div>
                    
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
            <FloatingSupportButton />
        </div>
    );
}
