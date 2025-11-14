<?php

namespace App\Domain\MedicalRecords\Services;

use App\Domain\MedicalRecords\DTOs\MedicalRecordData;
use App\Domain\MedicalRecords\Repositories\MedicalRecordRepository;
use App\Models\MedicalRecord;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MedicalRecordService
{
      private MedicalRecordRepository $repository;

      public function __construct(MedicalRecordRepository $repository)
      {
            $this->repository = $repository;
      }

      public function listMedicalRecords(?string $search, int $perPage = 10): LengthAwarePaginator
      {
            return $this->repository->list($search, $perPage);
      }

      public function create(MedicalRecordData $data): MedicalRecord
      {
            return $this->repository->create($data->toArray());
      }

      public function update(MedicalRecord $medicalRecord, MedicalRecordData $data): MedicalRecord
      {
            return $this->repository->update($medicalRecord, $data->toArray());
      }

      public function delete(MedicalRecord $medicalRecord): void
      {
            $this->repository->delete($medicalRecord);
      }
}
