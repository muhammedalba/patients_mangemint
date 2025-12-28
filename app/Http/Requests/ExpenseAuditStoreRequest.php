<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExpenseAuditStoreRequest extends FormRequest
{
      public function authorize(): bool
      {
            return true;
      }

      public function rules(): array
      {
            return [
                  'expense_id' => ['required', 'exists:expenses,id'],
                  'amount' => ['required', 'numeric'],
                  'note' => ['nullable', 'string'],
            ];
      }
}
