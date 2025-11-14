<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ToothStoreRequest extends FormRequest
{
      public function authorize(): bool
      {
            return true;
      }

      public function rules(): array
      {
            return [
                  'patient_id' => 'required|exists:patients,id',
                  'tooth_number' => [
                        'required',
                        'string',
                        'max:255',
                        Rule::unique('teeth')->where(function ($query) {
                              return $query->where('patient_id', $this->input('patient_id'));
                        }),
                  ],
                  'status' => 'nullable|string|max:255',
                  'notes' => 'nullable|string',
            ];
      }
}
