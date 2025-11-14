<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Http\Requests\PatientStoreRequest;
use App\Http\Requests\PatientUpdateRequest;
use Inertia\Inertia;
use App\Models\Patient;
use App\Models\Service;
use App\Domain\Patients\Services\PatientService;
use App\Domain\Patients\DTOs\PatientData;

class PatientController extends Controller
{
    public function __construct(private PatientService $service) {}

    public function index()
    {
        $filters = request()->only('search');
        $patients = $this->service->getAllPatients($filters);

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'filters' => $filters,
        ]);
    }



    public function create()
    {
        return Inertia::render('Patients/Create', [
            'genders' => ['male' => 'Male', 'female' => 'Female', 'other' => 'Other'],
            'marital_statuses' => [
                'single' => 'Single',
                'married' => 'Married',
                'divorced' => 'Divorced',
                'widowed' => 'Widowed',
            ],
        ]);
    }


    public function store(PatientStoreRequest $request)
    {
        try {
            $data = PatientData::fromArray($request->validated());

            $this->service->createPatient($data);

            return redirect()
                ->route('patients.index')
                ->with('success', __('Patient created successfully.'));
        } catch (\Throwable $e) {
            Log::error('Failed to create patient', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data'  => $request->all(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', __('Something went wrong while creating the patient.'));
        }
    }


    public function edit(Patient $patient)
    {
        return Inertia::render('Patients/Edit', [
            'patient' => [
                'id' => $patient->id,
                'name' => $patient->name,
                'email' => $patient->email,
                'phone' => $patient->phone,
                'address' => $patient->address,
                'notes' => $patient->notes,
                'birth_date' => $patient->birth_date,
                'gender' => $patient->gender,
                'marital_status' => $patient->marital_status,
            ],
            'genders' => [
                'male' => 'Male',
                'female' => 'Female',
                'other' => 'Other',
            ],
            'marital_statuses' => [
                'single' => 'Single',
                'married' => 'Married',
                'divorced' => 'Divorced',
                'widowed' => 'Widowed',
            ],
        ]);
    }


    public function update(PatientUpdateRequest $request, Patient $patient)
    {
        try {
            $data = PatientData::fromArray($request->validated());
            $this->service->updatePatient($patient, $data);

            return redirect()
                ->route('patients.index')
                ->with('success', __('Patient updated successfully.'));
        } catch (\Throwable $e) {
            Log::error('Failed to update patient', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'patient_id' => $patient->id,
                'data' => $request->all(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', __('Something went wrong while updating the patient.'));
        }
    }



    public function details(Patient $patient, $toothId = null)
    {
        $patientDetails = $this->service->getPatientDetails($patient, $toothId);

        return Inertia::render('Patients/Details', $patientDetails);
    }

    public function getTeeth(Patient $patient)
    {
        $teeth = $patient->teeth()->select('id', 'tooth_number', 'status')->get();

        return response()->json(['teeth' => $teeth]);
    }









    public function destroy(Patient $patient)
    {
        try {
            $this->service->deletePatient($patient);

            return redirect()
                ->route('patients.index')
                ->with('success', __('Patient deleted successfully.'));
        } catch (\Throwable $e) {
            Log::error('Failed to delete patient', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'patient_id' => $patient->id,
            ]);

            return redirect()
                ->route('patients.index')
                ->with('error', __('Something went wrong while deleting the patient.'));
        }
    }
}
