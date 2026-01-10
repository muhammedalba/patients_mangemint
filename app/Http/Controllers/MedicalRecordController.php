<?php

namespace App\Http\Controllers;

use App\Http\Requests\MedicalRecordStoreRequest;
use App\Http\Requests\MedicalRecordUpdateRequest;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\User;
use App\Domain\MedicalRecords\DTOs\MedicalRecordData;
use App\Domain\MedicalRecords\Services\MedicalRecordService;
use Barryvdh\DomPDF\Facade\Pdf;
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
    public function create($patient_id = null): Response
    {
        $patients = $patient_id
            ? Patient::select('id', 'name')->where('id', $patient_id)->get()
            : Patient::select('id', 'name')->latest('updated_at')->get();

        $doctors = User::whereHas('roles', fn($q) => $q->where('name', 'doctor'))->select('id', 'name')->latest('name')->get();
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

        //return redirect()->route('medical-records.index')->with('success', 'Medical record created successfully.');
        return redirect()->route('patients.details', $data->patient_id)
                 ->with('success', 'Medical record created successfully.');
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MedicalRecord $medicalRecord): Response
    {
        // get medical record with patient and doctor relationships
        $medicalRecord->load('patient:id,name', 'doctor:id,name');
        $doctors = User::whereHas('roles', fn($q) => $q->where('name', 'doctor'))->get();
        $patients = Patient::select('id', 'name')->latest('updated_at')->get();


        return Inertia::render('MedicalRecords/Edit', [
            'medicalRecord' => $medicalRecord,
            'doctors' => $doctors,
            'patients' => $patients,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MedicalRecordUpdateRequest $request, MedicalRecord $medicalRecord): RedirectResponse
    {

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

    public function download(MedicalRecord $medicalRecord)
    {
        $medicalRecord->load('patient:id,name', 'doctor:id,name');
        $pdf = Pdf::loadView('medical_records.pdf', ['medicalRecord' => $medicalRecord]);
        return $pdf->download('medical-record-' . $medicalRecord->id . '.pdf');
    }
}
