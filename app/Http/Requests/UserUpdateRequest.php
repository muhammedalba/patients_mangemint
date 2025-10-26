<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
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
        // $this->route('user')  يصل إلى المستخدم الذي يتم تحديثه من المسار
        $userToUpdate = $this->route('user');

        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique(User::class)->ignore($userToUpdate->id),
            ],
            'roles' => 'required|array',
            'roles.*' => 'in:admin,doctor,receptionist,patient',
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6', // كلمة المرور اختيارية عند التحديث
        ];
    }
}
