<?php

namespace App\Domain\Users\DTOs;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use Illuminate\Foundation\Http\FormRequest;

class UserData
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $password = null,
        public ?string $phone = null,
        public array $roles = []
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            name: $validated['name'],
            email: $validated['email'],
            password: $validated['password'] ?? null,
            phone: $validated['phone'] ?? null,
            roles: $validated['roles'] ?? []
        );
    }

    public function toArray(): array
    {
        $data = [
            'name'  => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
        ];

        if ($this->password) {
            $data['password'] = $this->password;
        }

        return $data;
    }
}
