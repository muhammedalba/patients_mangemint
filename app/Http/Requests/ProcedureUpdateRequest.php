<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcedureUpdateRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cost' => 'required|numeric|min:0',
            'duration_minutes' => 'nullable|integer|min:1',
            'processing_date' => 'nullable|date',
            'patient_id' => 'required|exists:patients,id',
            'tooth_id' => [
                'nullable',
                'exists:teeth,id',
                function ($attribute, $value, $fail) {
                    $tooth = \App\Models\Tooth::select('patient_id')->find($value);

                    if ($tooth && $this->route('procedure')->tooth && $tooth->patient_id !== $this->route('procedure')->tooth->patient_id) {
                        $fail('The selected tooth does not belong to the same patient as this procedure.');
                    }
                },
            ],
            'follow_up_days' => 'nullable|integer',
        ];
    }
}
