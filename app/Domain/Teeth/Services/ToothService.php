<?php

namespace App\Domain\Teeth\Services;

use App\Domain\Teeth\DTOs\ToothData;
use App\Domain\Teeth\Repositories\ToothRepository;
use App\Models\Tooth;
use Illuminate\Support\Facades\Log;

class ToothService
{
    public function __construct(private ToothRepository $repo) {}

    public function listTeeth(?string $search = null, int $perPage = 10)
    {
        return $this->repo->list($search, $perPage);
    }

    public function create(ToothData $data): Tooth
    {
        try {
            return $this->repo->create($data->toArray());
        } catch (\Throwable $e) {
            Log::error('Tooth creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data->toArray(),
            ]);
            throw $e;
        }
    }

    public function update(Tooth $tooth, ToothData $data): Tooth
    {
        try {
            return $this->repo->update($tooth, $data->toArray());
        } catch (\Throwable $e) {
            Log::error('Tooth update failed', [
                'tooth_id' => $tooth->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data->toArray(),
            ]);
            throw $e;
        }
    }

    public function delete(Tooth $tooth): void
    {
        $this->repo->delete($tooth);
    }
}
