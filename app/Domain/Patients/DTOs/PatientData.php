<?php

namespace App\Domain\Patients\DTOs;

class PatientData
{
      public function __construct(
            public string $name,
            public ?string $email= null,
            public ?string $phone= null,
            public ?string $address = null,
            public ?string $notes = null,
            public string $birth_date,
            public string $gender,
            public string $marital_status
      ) {}

      public static function fromArray(array $data): self
      {
            return new self(
                  $data['name'],
                  $data['email']?? null,
                  $data['phone']?? null,
                  $data['address'] ?? null,
                  $data['notes'] ?? null,
                  $data['birth_date'],
                  $data['gender'],
                  $data['marital_status']
            );
      }

      public function toArray(): array
      {
            return [
                  'name' => $this->name,
                  'email' => $this->email,
                  'phone' => $this->phone,
                  'address' => $this->address,
                  'notes' => $this->notes,
                  'birth_date' => $this->birth_date,
                  'gender' => $this->gender,
                  'marital_status' => $this->marital_status,
            ];
      }
}
