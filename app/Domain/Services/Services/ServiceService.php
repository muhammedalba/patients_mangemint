<?php

namespace App\Domain\Services\Services;

use App\Domain\Services\DTOs\ServiceData;
use App\Domain\Services\Repositories\ServiceRepository;
use App\Models\Service;
use Illuminate\Support\Facades\Log;

class ServiceService
{
      public function __construct(private ServiceRepository $repo) {}

      public function listServices(?string $search = null, int $perPage = 10)
      {
            return $this->repo->list($search, $perPage);
      }

      public function create(ServiceData $data): Service
      {
            try {
                  return $this->repo->create($data->toArray());
            } catch (\Throwable $e) {
                  Log::error('Service creation failed', [
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                        'data' => $data->toArray(),
                  ]);
                  throw $e;
            }
      }

      public function update(Service $service, ServiceData $data): Service
      {
            try {
                  return $this->repo->update($service, $data->toArray());
            } catch (\Throwable $e) {
                  Log::error('Service update failed', [
                        'service_id' => $service->id,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString(),
                        'data' => $data->toArray(),
                  ]);
                  throw $e;
            }
      }

      public function delete(Service $service): void
      {
            $this->repo->delete($service);
      }
}
