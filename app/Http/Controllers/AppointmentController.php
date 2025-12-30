<?php

namespace App\Http\Controllers;

use App\Domain\Appointments\DTOs\AppointmentData;
use App\Domain\Appointments\Services\AppointmentService;
use App\Http\Requests\AppointmentAvailableRequest;
use App\Http\Requests\AppointmentStoreRequest;
use App\Http\Requests\AppointmentUpdateRequest;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\ServiceCategory;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;


class AppointmentController extends Controller
{
    public function __construct(private AppointmentService $service) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $appointments = $this->service->listAppointments($request->input('search'), 10);
        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $services_category = ServiceCategory::with('services:category_id,id,name')
            ->select('id', 'name')->latest('name')
            ->get();
        return Inertia::render('Appointments/Create', [
            'patients' => Patient::select('id', 'name')
                ->latest('updated_at')
                ->get(),

            'doctors' => User::role('doctor')->get(['id', 'name']), // Assuming you have a 'doctor' role
            'services' => $services_category,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AppointmentStoreRequest $request): RedirectResponse
    {

        $data = AppointmentData::fromValidated($request->validated());
        $this->service->create($data);

        return redirect()
            ->route('appointments.index')
            ->with('success', 'Appointment booked successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment): Response
    {
        $appointment->load(['patient', 'doctor', 'procedure']);
        return Inertia::render('Appointments/Show', [
            'appointment' => $appointment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment): Response
    {
        $services_category = ServiceCategory::with('services:category_id,id,name')
            ->select('id', 'name')->latest('name')
            ->get();
        // get patients
        $patients = Patient::select('id', 'name')
            ->latest('name')
            ->get();


        return Inertia::render('Appointments/Edit', [
            'appointment' => $appointment,
            'patients' => $patients,
            'doctors' => User::role('doctor')->get(['id', 'name']), // Assuming you have a 'doctor' role
            'services' => $services_category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AppointmentUpdateRequest $request, Appointment $appointment): RedirectResponse
    {

            $data = AppointmentData::fromValidated($request->validated());
            $this->service->update($appointment, $data);

            return redirect()->route('appointments.index')->with('success', 'Appointment updated successfully.');

    }

    /**
     * available Slots
     *
     *
     */
    public function availableSlots(AppointmentAvailableRequest $request)
    {
        $available_appointments = $this->service->availableSlots($request->validated());

        return response()->json([
            'available_appointments' => $available_appointments
        ]);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment): RedirectResponse
    {
        $this->service->delete($appointment);

        return redirect()->route('appointments.index')->with('success', 'Appointment deleted successfully.');
    }
}
