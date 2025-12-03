export type User = {
    id: number;
    name: string;
    email: string;
    phone?: string;
};

export type Tooth = {
    id: number;
    name: string;
    tooth_number: string;
    status: string;
    notes: string;
};

export type Patient = {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    notes?: string;
    teeth: Tooth[];
    procedures: Procedure[];
    birth_date: string;
    gender: 'male' | 'female' | 'other';
    marital_status: 'single' | 'married' | 'divorced' | 'widowed';
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
    service_id: number;
    appointment_date: string;
    notes?: string;
    status: 'scheduled' | 'completed' | 'canceled';
    patient?: Patient;
    doctor?: User;
    procedure?: Procedure;
    times: string[];
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: {
        location: string;
        query: Record<string, string>;
    };
    flash: {
        success?: string;
        error?: string;
    };
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

export type Service = {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: string;
};

export type ServiceCategory = {
    id: number;
    name: string;
    services: Service[];
};
