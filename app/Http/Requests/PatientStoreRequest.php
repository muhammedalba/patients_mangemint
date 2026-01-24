<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PatientStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // يمكن إضافة صلاحيات هنا إذا لزم الأمر
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
            'name' => 'required|string|max:255|unique:patients,name',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|unique:patients,email',
            'address' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:500',
            'birth_date' => 'required|date',
            'gender' => 'required|string|in:male,female,other',
            'marital_status' => 'required|string|in:single,married,divorced,widowed|max:20',



        ];
    }

}
