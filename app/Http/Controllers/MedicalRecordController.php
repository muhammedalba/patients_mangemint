<?php

namespace App\Http\Controllers;

use App\Http\Requests\MedicalRecordStoreRequest;
use App\Http\Requests\MedicalRecordUpdateRequest;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicalRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = MedicalRecord::with('patient', 'doctor');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('chief_complaint', 'like', "%{$search}%")
                    ->orWhereHas('patient', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('doctor', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $medicalRecords = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('MedicalRecords/Index', [
            'medicalRecords' => $medicalRecords,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $patients = Patient::all();
        $doctors = User::whereHas('roles', fn ($q) => $q->where('name', 'doctor'))->get();
        return Inertia::render('MedicalRecords/Create', [
            'patients' => $patients,
            'doctors' => $doctors,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MedicalRecordStoreRequest $request): RedirectResponse
    {
        MedicalRecord::create($request->validated());

        return redirect()->route('medical-records.index')->with('success', 'Medical record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(MedicalRecord $medicalRecord): Response
    {
        $medicalRecord->load('patient', 'doctor');
        return Inertia::render('MedicalRecords/Show', [
            'medicalRecord' => $medicalRecord,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MedicalRecord $medicalRecord): Response
    {
        $medicalRecord->load('patient', 'doctor');
        $patients = Patient::all();
        $doctors = User::whereHas('roles', fn ($q) => $q->where('name', 'doctor'))->get();
        return Inertia::render('MedicalRecords/Edit', [
            'medicalRecord' => $medicalRecord,
            'patients' => $patients,
            'doctors' => $doctors,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MedicalRecordUpdateRequest $request, MedicalRecord $medicalRecord): RedirectResponse
    {
        $medicalRecord->update($request->validated());

        return redirect()->route('medical-records.index')->with('success', 'Medical record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MedicalRecord $medicalRecord): RedirectResponse
    {
        $medicalRecord->delete();

        return redirect()->route('medical-records.index')->with('success', 'Medical record deleted successfully.');
    }
}
