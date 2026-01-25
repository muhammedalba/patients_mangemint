import { Headset } from 'lucide-react';

export default function FloatingSupportButton() {
    return (
        <a
            href="https://codeprops.com/ar/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-teal-700 active:scale-95 group sm:bottom-8 sm:left-8"
            title="الدعم الفني والخدمات"
        >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-xl pointer-events-none">
                تحتاج مساعدة؟
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
            </div>
            
            <Headset className="size-7 transition-transform duration-500 group-hover:rotate-12" />
            
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-20" />
        </a>
    );
}
