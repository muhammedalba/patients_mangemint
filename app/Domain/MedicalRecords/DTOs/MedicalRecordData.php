<?php

// namespace App\Domain\MedicalRecords\DTOs;

// final class MedicalRecordData
// {
    /**
     * Store validated attributes as a simple array.
     * We intentionally keep this generic so it accepts any validated fields
     * provided by the Form Request objects.
     *
     * @var array
     */
    // public array $attributes;

    // private function __construct(array $attributes)
    // {
    //     $this->attributes = $attributes;
    // }

    // public static function fromValidated(array $validated): self
    // {
    //     return new self($validated);
    // }

    // public function toArray(): array
    // {
    //     return $this->attributes;
    // }
// }

namespace App\Domain\MedicalRecords\DTOs;

final class MedicalRecordData
{
    public function __construct(
        public int $patient_id,
        public ?int $doctor_id = null,
        public ?array $attachments = null,
        public ?array $images = null,
        public ?string $chief_complaint = null,
        public ?string $present_illness_history = null,
        public ?string $past_dental_history = null,
        public bool $has_cardiovascular_disease = false,
        public bool $has_hypertension = false,
        public bool $has_respiratory_disease = false,
        public bool $has_gastrointestinal_disease = false,
        public bool $has_neural_disease = false,
        public bool $has_hepatic_disease = false,
        public bool $has_renal_disease = false,
        public bool $has_endocrine_disease = false,
        public bool $has_diabetes = false,
        public ?string $medical_disease_details = null,
        public ?string $allergic_to = null,
        public ?string $current_medications = null,
        public bool $hospitalized_or_operated = false,
        public ?string $hospital_details = null,
        public bool $abnormal_bleeding_history = false,
        public bool $is_pregnant = false,
        public ?string $pregnancy_trimester = null,
        public ?string $clinical_notes = null,
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            patient_id: (int) $validated['patient_id'],
            doctor_id: isset($validated['doctor_id']) ? (int) $validated['doctor_id'] : null,
            attachments: $validated['attachments'] ?? null,
            images: $validated['images'] ?? null,
            chief_complaint: $validated['chief_complaint'] ?? null,
            present_illness_history: $validated['present_illness_history'] ?? null,
            past_dental_history: $validated['past_dental_history'] ?? null,
            has_cardiovascular_disease: $validated['has_cardiovascular_disease'] ?? false,
            has_hypertension: $validated['has_hypertension'] ?? false,
            has_respiratory_disease: $validated['has_respiratory_disease'] ?? false,
            has_gastrointestinal_disease: $validated['has_gastrointestinal_disease'] ?? false,
            has_neural_disease: $validated['has_neural_disease'] ?? false,
            has_hepatic_disease: $validated['has_hepatic_disease'] ?? false,
            has_renal_disease: $validated['has_renal_disease'] ?? false,
            has_endocrine_disease: $validated['has_endocrine_disease'] ?? false,
            has_diabetes: $validated['has_diabetes'] ?? false,
            medical_disease_details: $validated['medical_disease_details'] ?? null,
            allergic_to: $validated['allergic_to'] ?? null,
            current_medications: $validated['current_medications'] ?? null,
            hospitalized_or_operated: $validated['hospitalized_or_operated'] ?? false,
            hospital_details: $validated['hospital_details'] ?? null,
            abnormal_bleeding_history: $validated['abnormal_bleeding_history'] ?? false,
            is_pregnant: $validated['is_pregnant'] ?? false,
            pregnancy_trimester: $validated['pregnancy_trimester'] ?? null,
            clinical_notes: $validated['clinical_notes'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'patient_id' => $this->patient_id,
            'doctor_id' => $this->doctor_id,
            'attachments' => $this->attachments,
            'images' => $this->images,
            'chief_complaint' => $this->chief_complaint,
            'present_illness_history' => $this->present_illness_history,
            'past_dental_history' => $this->past_dental_history,
            'has_cardiovascular_disease' => $this->has_cardiovascular_disease,
            'has_hypertension' => $this->has_hypertension,
            'has_respiratory_disease' => $this->has_respiratory_disease,
            'has_gastrointestinal_disease' => $this->has_gastrointestinal_disease,
            'has_neural_disease' => $this->has_neural_disease,
            'has_hepatic_disease' => $this->has_hepatic_disease,
            'has_renal_disease' => $this->has_renal_disease,
            'has_endocrine_disease' => $this->has_endocrine_disease,
            'has_diabetes' => $this->has_diabetes,
            'medical_disease_details' => $this->medical_disease_details,
            'allergic_to' => $this->allergic_to,
            'current_medications' => $this->current_medications,
            'hospitalized_or_operated' => $this->hospitalized_or_operated,
            'hospital_details' => $this->hospital_details,
            'abnormal_bleeding_history' => $this->abnormal_bleeding_history,
            'is_pregnant' => $this->is_pregnant,
            'pregnancy_trimester' => $this->pregnancy_trimester,
            'clinical_notes' => $this->clinical_notes,
        ], fn($v) => $v !== null || $v === 0 || is_bool($v) || is_array($v));
    }
}
