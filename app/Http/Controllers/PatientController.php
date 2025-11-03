<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Http\Requests\PatientStoreRequest;
use App\Http\Requests\PatientUpdateRequest;
use Inertia\Inertia;
use App\Models\Patient;
use App\Models\Service;

class PatientController extends Controller
{
    public function index()
    {
        $search = request()->query('search');

        $patients = Patient::query()
            ->select('id', 'name', 'email', 'phone', 'birth_date', 'gender', 'marital_status') // جلب فقط الأعمدة المطلوبة
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString(); // يحافظ على قيمة البحث عند التنقل بين الصفحات

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'filters' => ['search' => $search],
        ]);
    }



    public function create()
    {
        $services = Service::select('id', 'name', 'price')->get();
        return Inertia::render('Patients/Create', [
            'genders' => ['male' => 'Male', 'female' => 'Female', 'other' => 'Other'],
            'marital_statuses' => [
                'single' => 'Single',
                'married' => 'Married',
                'divorced' => 'Divorced',
                'widowed' => 'Widowed',
            ],
            'services' => $services,
        ]);
    }


    public function store(PatientStoreRequest $request)
    {
        try {
            $validated = $request->validated();

            Patient::create($validated);
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
        $services = Service::select('id', 'name', 'price')->get();
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
            'services' => $services,
        ]);
    }


    public function update(PatientUpdateRequest $request, Patient $patient)
    {
        try {
            $validated = $request->validated();

            $patient->update($validated);

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
        $patient->load('teeth');

        $toothWithProcedures = null;
        //
        $services = Service::select('id', 'name', 'price')->get();

        if ($toothId) {
            $toothWithProcedures = $patient->teeth()
                ->where('id', $toothId)
                ->with('procedures')
                ->first();
        }

        return Inertia::render('Patients/Details', [
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
                'teeth' => $patient->teeth->map(function ($tooth) {
                    return [
                        'id' => $tooth->id,
                        'tooth_number' => $tooth->tooth_number,
                        'status' => $tooth->status,
                        'notes' => $tooth->notes,
                        'status' => $tooth->status,
                    ];
                }),
            ],
            'services' => $services,
            'tooth' => $toothWithProcedures
                ? [
                    'id' => $toothWithProcedures->id,
                    'tooth_number' => $toothWithProcedures->tooth_number,
                    'procedures' => $toothWithProcedures->procedures
                    // ->map(function ($procedure) {
                    //     return [
                    //         'id' => $procedure->id,
                    //         'name' => $procedure->name,
                    //         'cost' => $procedure->cost,
                    //         'notes' => $procedure->notes,
                    //     ];
                    // }),
                ]
                : null,
        ]);
    }









    public function destroy(Patient $patient)
    {
        try {
            $patient->delete();

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
