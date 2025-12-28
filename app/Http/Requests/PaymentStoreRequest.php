<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => 'required|exists:patients,id',
            'amount' => ['required', 'numeric', 'between:0.01,999999.99'],
            'payment_date' => 'required|date',
            'notes' => 'nullable|string|max:500',


        ];
    }
}
