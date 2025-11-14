<?php

namespace App\Domain\ServiceCategories\DTOs;

class ServiceCategoryData
{
    public function __construct(
        public string $name,
        public ?string $description = null
    ) {}

    public static function fromValidated(array $validated): self
    {
        return new self(
            name: $validated['name'],
            description: $validated['description'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
