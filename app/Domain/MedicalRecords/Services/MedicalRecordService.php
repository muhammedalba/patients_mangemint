<?php

namespace App\Domain\MedicalRecords\Services;

use App\Domain\MedicalRecords\DTOs\MedicalRecordData;
use App\Domain\MedicalRecords\Repositories\MedicalRecordRepository;
use App\Models\MedicalRecord;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class MedicalRecordService
{
    private const STORAGE_DISK = 'public';
    private const STORAGE_PATH = 'medical-records';

    public function __construct(
        private readonly MedicalRecordRepository $repository
    ) {}

    public function listMedicalRecords(?string $search, int $perPage = 10): LengthAwarePaginator
    {
        return $this->repository->list($search, $perPage);
    }

    public function create(MedicalRecordData $data): MedicalRecord
    {
        return DB::transaction(function () use ($data) {
            $attributes = $data->toArray();

            $attributes['attachments'] = $this->storeFiles($attributes['attachments'] ?? []);
            $attributes['images'] = $this->storeFiles($attributes['images'] ?? []);

            return $this->repository->create($attributes);
        });
    }

    public function update(MedicalRecord $medicalRecord, MedicalRecordData $data): MedicalRecord
    {
        return DB::transaction(function () use ($medicalRecord, $data) {
            $attributes = $data->toArray();

            $attributes['attachments'] = $this->updateFiles(
                current: $medicalRecord->attachments ?? [],
                uploaded: $attributes['attachments'] ?? [],
                deleted: $data->deleted_attachments ?? []
            );

            $attributes['images'] = $this->updateFiles(
                current: $medicalRecord->images ?? [],
                uploaded: $attributes['images'] ?? [],
                deleted: $data->deleted_images ?? []
            );

            return $this->repository->update($medicalRecord, $attributes);
        });
    }

    public function delete(MedicalRecord $medicalRecord): void
    {
        DB::transaction(function () use ($medicalRecord) {
            $this->deleteFiles($medicalRecord->attachments ?? []);
            $this->deleteFiles($medicalRecord->images ?? []);
            $this->repository->delete($medicalRecord);
        });
    }

    public function deleteSingleFile(MedicalRecord $medicalRecord, string $path, string $type): void
    {
        if (!in_array($type, ['images', 'attachments'], true)) {
            throw new \InvalidArgumentException('Invalid file type.');
        }

        $files = $medicalRecord->$type ?? [];

        if (!in_array($path, $files, true)) {
            return;
        }

        $this->deleteFiles([$path]);

        $newFiles = collect($files)
            ->reject(fn($f) => $f === $path)
            ->values()
            ->all();

        $medicalRecord->update([$type => $newFiles]);
    }

    /**
     * Store uploaded files and return their paths
     *
     * @param array<int, UploadedFile> $files
     * @return array<int, string>
     */
    private function storeFiles(array $files): array
    {
        return collect($files)
            ->filter(fn($file) => $file instanceof UploadedFile)
            ->map(fn(UploadedFile $file) => $file->store(self::STORAGE_PATH, self::STORAGE_DISK))
            ->values()
            ->all();
    }

    /**
     * Delete files from storage
     *
     * @param array<int, string> $paths
     */
    private function deleteFiles(array|string|null $paths): void
    {
        $paths = (array) $paths;

        if (empty($paths)) {
            return;
        }

        $disk = Storage::disk(self::STORAGE_DISK);

        collect($paths)
            ->filter(fn($path) => $disk->exists($path))
            ->each(fn($path) => $disk->delete($path));
    }

    /**
     * Update files by merging current, uploaded, and handling deletions
     *
     * @param array<int, string> $current
     * @param array<int, UploadedFile> $uploaded
     * @param array<int, string> $deleted
     * @return array<int, string>
     */
    private function updateFiles(array $current, array $uploaded, array $deleted): array
    {
        // Delete marked files
        $this->deleteFiles($deleted);

        // Filter out deleted files from current
        $remainingFiles = collect($current)
            ->reject(fn($path) => in_array($path, $deleted, true))
            ->values();

        // Store new uploaded files
        $newFiles = $this->storeFiles($uploaded);

        // Merge and return
        return $remainingFiles
            ->merge($newFiles)
            ->values()
            ->all();
    }
}
