<?php

namespace App\Http\Controllers;

use App\Http\Requests\MedicalRecordStoreRequest;
use App\Http\Requests\MedicalRecordUpdateRequest;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\User;
use App\Domain\MedicalRecords\DTOs\MedicalRecordData;
use App\Domain\MedicalRecords\Services\MedicalRecordService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicalRecordController extends Controller
{
    private MedicalRecordService $service;

    public function __construct(MedicalRecordService $service)
    {
        $this->service = $service;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $medicalRecords = $this->service->listMedicalRecords($search, 10);

        return Inertia::render('MedicalRecords/Index', [
            'medicalRecords' => $medicalRecords,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $patients = Patient::select('id', 'name')->orderBy('name', 'asc')->get();
        $doctors = User::whereHas('roles', fn($q) => $q->where('name', 'doctor'))->select('id', 'name')->orderBy('name', 'asc')->get();
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
        $data = MedicalRecordData::fromValidated($request->validated());

        $this->service->create($data);

        return redirect()->route('medical-records.index')->with('success', 'Medical record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    // public function show(MedicalRecord $medicalRecord): Response
    // {
    //     $medicalRecord->load('patient', 'doctor');
    //     return Inertia::render('MedicalRecords/Show', [
    //         'medicalRecord' => $medicalRecord,
    //     ]);
    // }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MedicalRecord $medicalRecord): Response
    {
        // get medical record with patient and doctor relationships
        $medicalRecord->load('patient:id,name', 'doctor:id,name');
        $doctors = User::whereHas('roles', fn($q) => $q->where('name', 'doctor'))->get();

        return Inertia::render('MedicalRecords/Edit', [
            'medicalRecord' => $medicalRecord,
            'doctors' => $doctors,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MedicalRecordUpdateRequest $request, MedicalRecord $medicalRecord): RedirectResponse
    {
        // dd($request->getContent());
        // dd($request->json()->all());
        $data = MedicalRecordData::fromValidated($request->validated());
        $this->service->update($medicalRecord, $data);

        return redirect()->route('medical-records.index')->with('success', 'Medical record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MedicalRecord $medicalRecord): RedirectResponse
    {
        $this->service->delete($medicalRecord);

        return redirect()->route('medical-records.index')->with('success', 'Medical record deleted successfully.');
    }
}
