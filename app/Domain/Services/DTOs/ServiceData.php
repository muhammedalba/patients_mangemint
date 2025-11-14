<?php

namespace App\Domain\Services\DTOs;

class ServiceData
{
      public function __construct(
            public string $name,
            public ?string $description = null,
            public ?float $price = null,
            public ?int $category_id = null
      ) {}

      public static function fromValidated(array $validated): self
      {
            return new self(
                  name: $validated['name'],
                  description: $validated['description'] ?? null,
                  price: isset($validated['price']) ? (float) $validated['price'] : null,
                  category_id: $validated['category_id'] ?? null,
            );
      }

      public function toArray(): array
      {
            return array_filter([
                  'name' => $this->name,
                  'description' => $this->description,
                  'price' => $this->price,
                  'category_id' => $this->category_id,
            ], fn($v) => $v !== null || $v === 0);
      }
}
