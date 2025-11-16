<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentUpdateRequest extends FormRequest
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
            'patient_id' => 'required|exists:patients,id',
            'user_id' => 'required|exists:users,id', // الطبيب
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date_format:Y-m-d',
            'start_time' => ['required', 'date_format:H:i'], // أو H:i:s إذا ترسل ثواني
            'duration_slots' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:1000',
            'status' => 'sometimes|string|in:scheduled,completed,canceled'
        ];
    }
}
