<?php

namespace App\Domain\MonthClosures\DTOs;

class MonthClosureData
{
      public function __construct(
            public int $year,
            public int $month,
            public ?int $closed_by,
            public ?string $closed_at
      ) {}

      public static function fromArray(array $data): self
      {
            return new self(
                  (int) $data['year'],
                  (int) $data['month'],
                  isset($data['closed_by']) ? (int) $data['closed_by'] : null,
                  $data['closed_at'] ?? null
            );
      }

      public function toArray(): array
      {
            return [
                  'year' => $this->year,
                  'month' => $this->month,
                  'closed_by' => $this->closed_by,
                  'closed_at' => $this->closed_at,
            ];
      }
}
