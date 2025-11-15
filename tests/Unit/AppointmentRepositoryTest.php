<?php

namespace Tests\Unit;

use App\Domain\Appointments\Repositories\AppointmentRepository;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Patient;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class AppointmentRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private AppointmentRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new AppointmentRepository();
    }

    public function test_list_uses_cache()
    {
        Appointment::factory()->count(5)->create();

        // Warm the cache
        $this->repository->list();

        // Mock the cache to ensure it's being used
        Cache::shouldReceive('tags')
            ->with('appointments')
            ->once()
            ->andReturnSelf();

        Cache::shouldReceive('remember')
            ->once()
            ->andReturn(Appointment::paginate());


        $this->repository->list();
    }

    public function test_create_flushes_cache()
    {
        Cache::shouldReceive('tags')
            ->with('appointments')
            ->once()
            ->andReturnSelf();
        Cache::shouldReceive('flush')->once();

        $patient = Patient::factory()->create();
        $doctor = User::factory()->create();
        $service = Service::factory()->create();

        $this->repository->create([
            'patient_id' => $patient->id,
            'user_id' => $doctor->id,
            'service_id' => $service->id,
            'appointment_date' => now()->addDay()->toDateString(),
            'times' => [now()->format('H:i')],
            'status' => 'scheduled',
        ]);
    }

    public function test_update_flushes_cache()
    {
        $appointment = Appointment::factory()->create();

        Cache::shouldReceive('tags')
            ->with('appointments')
            ->once()
            ->andReturnSelf();
        Cache::shouldReceive('flush')->once();

        $this->repository->update($appointment, ['status' => 'confirmed']);
    }

    public function test_delete_flushes_cache()
    {
        $appointment = Appointment::factory()->create();

        Cache::shouldReceive('tags')
            ->with('appointments')
            ->once()
            ->andReturnSelf();
        Cache::shouldReceive('flush')->once();

        $this->repository->delete($appointment);
    }
}
