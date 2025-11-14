
import { Patient } from './patient';

export type Payment = {
    id: number;
    patient_id: number;
    amount: number;
    payment_date: string;
    paid_at: string;
    notes: string;
    patient?: Patient;
};
