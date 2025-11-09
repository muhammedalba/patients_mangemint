<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Procedure;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $appointments = Appointment::with(['patient', 'doctor', 'procedure'])->latest()->paginate(10);
        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Appointments/Create', [
            'patients' => Patient::all(['id', 'name']),
            'doctors' => User::role('doctor')->get(['id', 'name']), // Assuming you have a 'doctor' role
            'procedures' => Procedure::all(['id', 'name', 'cost', 'duration_minutes']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'user_id' => 'required|exists:users,id',
            'procedure_id' => 'required|exists:procedures,id',
            'appointment_date' => 'required|date',
            'times' => 'required|array',
            'times.*' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
            'status' => 'required|in:scheduled,completed,canceled',
        ]);

        Appointment::create($validatedData);

        return redirect()->route('appointments.index')->with('success', 'Appointment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment)
    {
        $appointment->load(['patient', 'doctor', 'procedure']);
        return Inertia::render('Appointments/Show', [
            'appointment' => $appointment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment)
    {
        return Inertia::render('Appointments/Edit', [
            'appointment' => $appointment,
            'patients' => Patient::all(['id', 'name']),
            'doctors' => User::role('doctor')->get(['id', 'name']), // Assuming you have a 'doctor' role
            'procedures' => Procedure::all(['id', 'name', 'cost', 'duration_minutes']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment)
    {
        $validatedData = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'user_id' => 'required|exists:users,id',
            'procedure_id' => 'required|exists:procedures,id',
            'appointment_date' => 'required|date',
            'times' => 'required|array',
            'times.*' => 'required|date_format:H:i',
            'notes' => 'nullable|string',
            'status' => 'required|in:scheduled,completed,canceled',
        ]);

        $appointment->update($validatedData);

        return redirect()->route('appointments.index')->with('success', 'Appointment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return redirect()->route('appointments.index')->with('success', 'Appointment deleted successfully.');
    }
}
