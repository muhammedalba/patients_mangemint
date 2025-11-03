<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceUpdateRequest extends FormRequest
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
        $serviceId = $this->route('service')->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('services')->ignore($serviceId),
            ],
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ];
    }
}
