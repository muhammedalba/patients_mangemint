<?php

namespace App\Domain\Patients\Services;

use App\Domain\Patients\DTOs\PatientData;
use App\Domain\Patients\Repositories\PatientRepository;
use \Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\Patient;

class PatientService
{
    public function __construct(private PatientRepository $repository) {}

    public function getAllPatients(array $filters = []): LengthAwarePaginator
    {
        return $this->repository->getAllPatients($filters);
    }

    public function createPatient(PatientData $data): Patient
    {
        return $this->repository->createPatient($data->toArray());
    }

    public function updatePatient(Patient $patient, PatientData $data): bool
    {
        return $this->repository->updatePatient($patient, $data->toArray());
    }

    public function deletePatient(Patient $patient): bool
    {
        return $this->repository->deletePatient($patient);
    }

    public function getPatientDetails(Patient $patient, $toothId = null): array
    {
        return $this->repository->getPatientDetails($patient, $toothId);
    }
}
