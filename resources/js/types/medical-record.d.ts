import { Paginated } from '@/types';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Patient {
    id: number;
    name: string;
    // Add other patient properties as needed
}

export interface MedicalRecord {
    id: number;
    patient_id: number;
    doctor_id: number;
    chief_complaint: string;
    history_of_present_illness: string;
    physical_examination: string;
    diagnosis: string;
    treatment_plan: string;
    created_at: string;
    updated_at: string;
    patient: Patient;
    doctor: User;
}

export type MedicalRecordIndexProps = {
    medicalRecords: Paginated<MedicalRecord>;
    filters: {
        search?: string;
    };
};
