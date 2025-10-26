<?php

namespace App\Http\Requests;

use App\Models\Patient;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PatientUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
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
        $patientToUpdate = $this->route('patient');

        return [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:500',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'email' => [
                'nullable',
                'email',
                Rule::unique(Patient::class)->ignore($patientToUpdate->id),
            ],
        ];
    }
}
