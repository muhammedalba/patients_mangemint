<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Patient;
use App\Models\Service;
use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class AppointmentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    public function test_can_list_appointments()
    {
        Appointment::factory()->count(3)->create();

        $this->get(route('appointments.index'))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Appointments/Index')
                ->has('appointments.data', 3)
            );
    }

    public function test_can_create_an_appointment()
    {
        $patient = Patient::factory()->create();
        $doctor = User::factory()->create();
        $service = Service::factory()->create();

        $appointmentData = [
            'patient_id' => $patient->id,
            'user_id' => $doctor->id,
            'service_id' => $service->id,
            'appointment_date' => now()->addDay()->toDateString(),
            'times' => [now()->format('H:i')],
            'status' => 'scheduled',
        ];

        $this->post(route('appointments.store'), $appointmentData)
            ->assertRedirect(route('appointments.index'));

        $this->assertDatabaseHas('appointments', [
            'patient_id' => $patient->id,
            'user_id' => $doctor->id,
        ]);
    }

    public function test_can_update_an_appointment()
    {
        $appointment = Appointment::factory()->create();
        $patient = Patient::factory()->create();

        $updateData = [
            'patient_id' => $patient->id,
            'user_id' => $appointment->user_id,
            'service_id' => $appointment->service_id,
            'appointment_date' => $appointment->appointment_date->toDateString(),
            'times' => $appointment->times,
            'status' => 'confirmed',
        ];

        $this->put(route('appointments.update', $appointment), $updateData)
            ->assertRedirect(route('appointments.index'));

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_can_delete_an_appointment()
    {
        $appointment = Appointment::factory()->create();

        $this->delete(route('appointments.destroy', $appointment))
            ->assertRedirect(route('appointments.index'));

        $this->assertDatabaseMissing('appointments', ['id' => $appointment->id]);
    }
}
