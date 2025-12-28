<?php

namespace App\Domain\ExpenseCategories\DTOs;

class ExpenseCategoryData
{
      public function __construct(
            public string $name,
            public string $type
      ) {}

      public static function fromArray(array $data): self
      {
            return new self(
                  $data['name'],
                  $data['type'] 
            );
      }

      public function toArray(): array
      {
            return [
                  'name' => $this->name,
                  'type' => $this->type,
            ];
      }
}
