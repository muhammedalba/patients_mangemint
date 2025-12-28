<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use App\Models\MonthClosure;
use Illuminate\Foundation\Http\FormRequest;

class ExpenseUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'expense_date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'expense_category_id' => ['required', 'exists:expense_categories,id'],
            'description' => ['nullable', 'string'],
            'payment_method' => ['nullable', 'in:cash,card,transfer,other'],

        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Parse the expense_date from the request (2024-06-10 format to get year and month)
            $date = Carbon::parse($this->expense_date);

            // Check if the expense_date falls within a closed month
            $isClosed = MonthClosure::where('year', $date->year)
                ->where('month', $date->month)
                ->exists();

            if ($isClosed) {
                $validator->errors()->add(
                    'expense_date',
                    'Cannot add expense to a closed month'
                );
            }
            // // check if year and month < current month/year
            // $currentYear = (int) date('Y');
            // $currentMonth = (int) date('m');

            // if ($date->year < $currentYear || ($date->month < $currentMonth)) {
            //     $validator->errors()->add(
            //         'expense_date',
            //         'Cannot add expense to a past month'
            //     );
            // }
        });
    }
}
