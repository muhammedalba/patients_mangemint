export type User = {
    id: number;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    roles: UserRole[];
    avatar?: string;
};

export type UserRole = {
    id: number;
    name: string;
    pivot: {
        model_type: string;
        model_id: number;
        role_id: number;
    };
};

export type ToothStatus =
    | 'healthy'
    | 'filled'
    | 'treated'
    | 'extracted'
    | 'crowned'
    | 'implant';

export interface Tooth {
    id: string;
    patient_id: number;
    tooth_number: string;
    status: string;
}

export type Patient = {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    birth_date: string;
    gender: 'male' | 'female';
    marital_status: 'single' | 'married' ;
};

export type Procedure = {
    id: number;
    name: string;
    description?: string;
    cost: number;
    duration_minutes: number;
    tooth: Tooth;
    tooth_id: number;
    patient: Patient;
    patient_id: number;
    status: string;
    processing_date: string;
    follow_up_days: number;
    category?: string;
    service_id?: number;
};

export type Appointment = {
    id: number;
    patient_id: number;
    user_id: number;
    service_id?: number;
    date: string;
    notes?: string;
    duration_slots: number;
    status: 'scheduled' | 'completed' | 'canceled';
    patient?: Patient;
    doctor?: User;
    start_time: string;
    end_time: string;
    service?: {
        id: number;
        name: string;
    };
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

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    from: number;
    last_page: number;
    last_page_url: string;
    first_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
    per_page: number;
    to: number;
    total: number;
    links: PaginationLink[];
};

// BreadcrumbItem type
export type BreadcrumbItem = {
    title: string;
    href?: string;
};

export type MedicalRecord = {
    id: number;
    patient_id: number;
    doctor_id: number;
    created_at: Date;
    attachments?: File[];
    images?: File[];
    deleted_attachments?: File[];
    deleted_images?: File[];
    chief_complaint?: string;
    present_illness_history?: string;
    past_dental_history?: string;
    has_cardiovascular_disease?: boolean;
    has_hypertension?: boolean;
    has_respiratory_disease?: boolean;
    has_gastrointestinal_disease?: boolean;
    has_neural_disease?: boolean;
    has_hepatic_disease?: boolean;
    has_renal_disease?: boolean;
    has_endocrine_disease?: boolean;
    has_diabetes?: boolean;
    medical_disease_details?: string;
    allergic_to?: string;
    current_medications?: string;
    hospitalized_or_operated?: boolean;
    hospital_details?: string;
    abnormal_bleeding_history?: boolean;
    is_pregnant?: boolean;
    pregnancy_trimester?: string;
    clinical_notes?: string;
};
export type Service = {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: string;
    category_id: string;
};

export type ServiceCategory = {
    id: number;
    name: string;
    description: string;
    services: Service[];
};
export type patientDetails = {
    id: number;
    name: string;
    birth_date: string;
    gender: 'male' | 'female' | 'other';
    marital_status: 'single' | 'married' | 'divorced' | 'widowed';
    medical_record: MedicalRecord;
    financial_summary: FinancialSummary;
    procedures: Procedure[];
    teeth: Tooth[];
};

type AppointmentSlot = {
    start: string;
    end: string;
    duration_minutes: number;
    slots: number;
};

type Expense = {
    id: number;
    amount: number;
    category: ExpenseCategory;
    description: string;
    payment_method: string;
    expense_date: string;
    expense_category_id: number;
    created_at: string;
};

type ExpenseCategory = {
    id: number;
    name: string;
    type: string;
};

type MonthClosures = {
    id: number;
    year: number;
    month: number;
    closed_at: string;
};

export type Payment = {
    id: number;
    patient_id: number;
    amount: number;
    payment_date: string;
    paid_at: string;
    notes: string;
    patient?: Patient;
};

export type FinancialSummary = {
    discount_amount: number;
    remaining_balance: number;
    total_payments: number;
    total_procedures: number;
    total_procedures_after_discount: number;
    total_procedures_cost: number;
};
export type NavItem = {
    title: string;
    href: string | ReturnType<typeof dashboard>;
    icon?: import('react').ComponentType<import('lucide-react').LucideProps>;
    color?: string;
    roles?: Role[];
};
