import { useEffect, useState } from "react";
import LoadingPage from "./components/LoadingPage";
import { router } from "@inertiajs/react";
type InertiaEvent = {
    detail?: {
        visit?: {
            only?: string[];
        };
    };
};
export default function AppWrapper({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);

  useEffect(() => {
      let timeout: any;

const start = (event: InertiaEvent) => {
    if (event.detail?.visit?.only?.length) return;

    timeout = setTimeout(() => {
        setLoading(true);
    }, 600);
};

const finish = () => {
    if (timeout) {
        clearTimeout(timeout);
    }
    setLoading(false);
};




        router.on('start', start);
        router.on('finish', finish);
        router.on('cancel', finish);
        router.on('error', finish);
    }, []);

    return (
        <>
            {loading && <LoadingPage />}
            {children}
        </>
    );
}