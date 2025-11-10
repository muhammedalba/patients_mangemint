<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MedicalRecordUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => [
                'required',
                Rule::unique('medical_records')->ignore($this->route('medicalRecord')->id),
            ],

            'doctor_id' => 'nullable|exists:users,id',
            'chief_complaint' => 'nullable|string',
            'present_illness_history' => 'nullable|string',
            'past_dental_history' => 'nullable|string',
            'has_cardiovascular_disease' => 'boolean',
            'has_hypertension' => 'boolean',
            'has_respiratory_disease' => 'boolean',
            'has_gastrointestinal_disease' => 'boolean',
            'has_neural_disease' => 'boolean',
            'has_hepatic_disease' => 'boolean',
            'has_renal_disease' => 'boolean',
            'has_endocrine_disease' => 'boolean',
            'has_diabetes' => 'boolean',
            'medical_disease_details' => 'nullable|string',
            'allergic_to' => 'nullable|string',
            'current_medications' => 'nullable|string',
            'hospitalized_or_operated' => 'boolean',
            'hospital_details' => 'nullable|string',
            'abnormal_bleeding_history' => 'boolean',
            'is_pregnant' => 'boolean',
            'pregnancy_trimester' => 'nullable|in:I,II,III',
            'clinical_notes' => 'nullable|string',
        ];
    }
}
