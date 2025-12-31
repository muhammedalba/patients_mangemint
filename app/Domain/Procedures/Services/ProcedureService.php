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
        return $this->repo->create($data->toArray());
    }

    public function update(Procedure $procedure, ProcedureData $data): Procedure
    {

        return $this->repo->update($procedure, $data->toArray());
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
