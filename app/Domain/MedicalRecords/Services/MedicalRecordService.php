<?php

namespace App\Domain\MedicalRecords\Services;

use App\Domain\MedicalRecords\DTOs\MedicalRecordData;
use App\Domain\MedicalRecords\Repositories\MedicalRecordRepository;
use App\Models\MedicalRecord;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

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
        $attributes = $data->toArray();

        if (isset($attributes['attachments'])) {
            $attributes['attachments'] = collect($attributes['attachments'])->map(function ($file) {
                return $file->store('medical-records', 'public');
            })->all();
        }

        if (isset($attributes['images'])) {
            $attributes['images'] = collect($attributes['images'])->map(function ($file) {
                return $file->store('medical-records', 'public');
            })->all();
        }

        return $this->repository->create($attributes);
    }

    public function update(MedicalRecord $medicalRecord, MedicalRecordData $data): MedicalRecord
    {
        $attributes = $data->toArray();
        // @dd($attributes);

        if (isset($attributes['attachments'])) {

            // Delete old attachments
            foreach ($medicalRecord->attachments ?? [] as $attachment) {
                Storage::disk('public')->delete($attachment);
            }

            $attributes['attachments'] = collect($attributes['attachments'])->map(function ($file) {
                return $file->store('medical-records', 'public');
            })->all();
        }

        if (isset($attributes['images'])) {

            // Delete old images
            foreach ($medicalRecord->images ?? [] as $image) {
                Storage::disk('public')->delete($image);
            }

            $attributes['images'] = collect($attributes['images'])->map(function ($file) {
                return $file->store('medical-records', 'public');
            })->all();
        }

        return $this->repository->update($medicalRecord, $attributes);
    }

    public function delete(MedicalRecord $medicalRecord): void
    {
        // Delete attachments if have any
        if ($medicalRecord->attachments) {
            foreach ($medicalRecord->attachments as $attachment) {
                Storage::disk('public')->delete($attachment);
            }
        }

        // Delete images
        if ($medicalRecord->images) {
            foreach ($medicalRecord->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }
        $this->repository->delete($medicalRecord);
    }
}
