<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatientStoreRequest;
use App\Http\Requests\PatientUpdateRequest;
use Inertia\Inertia;
use App\Models\Patient;
use App\Domain\Patients\Services\PatientService;
use App\Domain\Patients\DTOs\PatientData;
use App\Models\ServiceCategory;
use App\Providers\PdfService;
use Illuminate\Http\Request;


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

        $data = PatientData::fromArray($request->validated());

        $patient = $this->service->createPatient($data);
        return redirect()
            ->route('medical-records.create',  $patient->id)
            ->with('success', __('Patient created successfully.'));
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

        $data = PatientData::fromArray($request->validated());
        $this->service->updatePatient($patient, $data);

        return redirect()
            ->route('patients.index')
            ->with('success', __('Patient updated successfully.'));
    }
    // add discount amount to patient
    public function addDiscount(Request $request, Patient $patient)
    {
        $discountAmount = (float) $request->input('discount_amount', 0);

        $this->service->addDiscountToPatient($patient, $discountAmount);

        return redirect()
            ->route('patients.details', $patient)
            ->with('success', __('Discount amount added successfully.'));
    }


    public function details(Patient $patient, $toothId = null)
    {
        $services_category = ServiceCategory::with('services:id,category_id,name,price')
            ->select('id', 'name')
            ->latest('name')
            ->get();
        $patientDetails = $this->service->getPatientDetails($patient, $toothId);

        return Inertia::render('Patients/Details', [
            'patientDetails' => $patientDetails,
            'services_category' => $services_category,
        ]);
    }



    // Get Tooth Procedures
    public function getToothProcedures(Patient $patient, $toothId)
    {

        $toothProcedures = $this->service->getToothProcedures($patient, $toothId);
        return response()->json(['tooth_procedures' => $toothProcedures]);
    }


    public function destroy(Patient $patient)
    {

        $this->service->deletePatient($patient);

        return redirect()
            ->route('patients.index')
            ->with('success', __('Patient deleted successfully.'));
    }

    public function downloadInvoice(Patient $patient)
    {
        $patientDetails = $this->service->getPatientInvoiceData($patient);

        $html = view('patients.pdf', compact('patientDetails'))->render();

        $pdf = PdfService::make();
        $pdf->WriteHTML($html);

        return response($pdf->Output(
            'invoice-patient-' . $patient->id . '.pdf',
            'S'
        ))->header('Content-Type', 'application/pdf');
    }
}
