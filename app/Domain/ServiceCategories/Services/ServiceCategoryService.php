<?php

namespace App\Domain\ServiceCategories\Services;

use App\Domain\ServiceCategories\DTOs\ServiceCategoryData;
use App\Domain\ServiceCategories\Repositories\ServiceCategoryRepository;
use App\Models\ServiceCategory;
use Illuminate\Support\Facades\Log;

class ServiceCategoryService
{
      public function __construct(private ServiceCategoryRepository $repo) {}

      public function listCategories(?string $search = null, int $perPage = 10)
      {
            return $this->repo->list($search, $perPage);
      }

      public function create(ServiceCategoryData $data): ServiceCategory
      {
            try {
                  return $this->repo->create($data->toArray());
            } catch (\Throwable $e) {
                  Log::error('Service category creation failed', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                        'data'  => $data->toArray(),
                  ]);
                  throw $e;
            }
      }

      public function update(ServiceCategory $category, ServiceCategoryData $data): ServiceCategory
      {
            try {
                  return $this->repo->update($category, $data->toArray());
            } catch (\Throwable $e) {
                  Log::error('Service category update failed', [
                        'category_id' => $category->id,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                        'data' => $data->toArray(),
                  ]);
                  throw $e;
            }
      }

      public function delete(ServiceCategory $category): void
      {
            $this->repo->delete($category);
      }
}
