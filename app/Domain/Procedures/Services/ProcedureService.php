<?php

namespace App\Domain\Procedures\Services;

use App\Domain\Procedures\DTOs\ProcedureData;
use App\Domain\Procedures\Repositories\ProcedureRepository;
use App\Models\Procedure;
use Illuminate\Support\Facades\Log;

class ProcedureService
{
    public function __construct(private ProcedureRepository $repo) {}

    public function listProcedures(?string $search = null, int $perPage = 10)
    {
        return $this->repo->list($search, $perPage);
    }

    public function create(ProcedureData $data): Procedure
    {
        try {
            return $this->repo->create($data->toArray());
        } catch (\Throwable $e) {
            Log::error('Procedure creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data->toArray(),
            ]);
            throw $e;
        }
    }

    public function update(Procedure $procedure, ProcedureData $data): Procedure
    {
        try {
            return $this->repo->update($procedure, $data->toArray());
        } catch (\Throwable $e) {
            Log::error('Procedure update failed', [
                'procedure_id' => $procedure->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data->toArray(),
            ]);
            throw $e;
        }
    }

    public function delete(Procedure $procedure): void
    {
        $this->repo->delete($procedure);
    }

    public function find(int $id): ?Procedure
    {
        return $this->repo->find($id);
    }
}
