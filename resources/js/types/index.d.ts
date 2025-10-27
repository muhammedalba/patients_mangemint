import { type PageProps  } from '@inertiajs/core';

export type User = {
    id: number;
    name: string;
    email: string;
    phone?: string;
};

export type Tooth = {
    id: number;
    tooth_number: string;
    status: string;
    notes: string;
};

export type Patient = {
    id: number;
    name: string;
    email: string;
    phone?: string;
    teeth: Tooth[];
    procedures: Procedure[];
};

export type Procedure = {
    id: number;
    name: string;
    description?: string;
    cost: number;
    duration_minutes: number;
};

export type Appointment = {
    id: number;
    patient_id: number;
    user_id: number;
    procedure_id: number;
    appointment_date: string;
    notes?: string;
    status: 'scheduled' | 'completed' | 'canceled';
    patient?: Patient;
    doctor?: User;
    procedure?: Procedure;
    times: string[];
};

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    ziggy: {
        location: string;
        query: Record<string, string>;
    }
    flash: {
        success?: string;
        error?: string;
    }
};

export type PaginatedData<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
};
// BreadcrumbItem type
export type BreadcrumbItem = {
    title: string;
    href?: string;
};

export type MedicalRecord = {
    id: number;
    patient_id: number;
    details: string;
    date: string;
    attachments?: string;
    patient?: Patient;
    procedure_id?: number;
    procedure?: Procedure;
    doctor_id?: number;
    doctor?: User;
};
