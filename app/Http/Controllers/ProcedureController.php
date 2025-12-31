<?php

namespace App\Http\Controllers;

use App\Domain\Procedures\DTOs\ProcedureData;
use App\Domain\Procedures\Services\ProcedureService;
use App\Models\Patient;
use Inertia\Inertia;
use App\Models\Procedure;
use App\Models\ServiceCategory;
use App\Models\Tooth;
use Illuminate\Http\Request;
use App\Http\Requests\ProcedureStoreRequest;
use App\Http\Requests\ProcedureUpdateRequest;


class ProcedureController extends Controller
{
    private ProcedureService $service;

    public function __construct(ProcedureService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {

            $search = $request->input('search');

            $procedures = $this->service->listProcedures($search, 10);

            return Inertia::render('Procedures/Index', ['procedures' => $procedures]);

    }

    public function create(Request $request, $patient_id = null)
    {

            // تحديد معرّفات المريض والسن إن وُجدا
            $patientId = $patient_id ?? $request->query('patient_id');
            $toothId = $request->query('tooth_id');

            $teeth = $toothId ? Tooth::select('tooth_number', 'id')->where('id', $toothId)->get() : [];

            $patients = $patientId ? Patient::select('id', 'name')->find($patientId) : Patient::select('id', 'name')->latest('updated_at')->get();
            // get all services
            $services_category = ServiceCategory::with('services:category_id,id,name,price')
                ->select('id', 'name')->latest('name')
                ->get();

            return Inertia::render('Procedures/Create', [
                'teeth' => $teeth,
                'services_category' => $services_category,
                'patients' => $patients,
            ]);

    }

    public function store(ProcedureStoreRequest $request)
    {

            $data = ProcedureData::fromValidated($request->validated());
            $this->service->create($data);

            return redirect()->route('patients.details', $data->patient_id)->with('success', 'Procedure created successfully.');

    }

    public function edit(Procedure $procedure)
    {

            // ensure we have the relations loaded via service to mirror repository behavior with patient
            // $procedure = $this->service->find($procedure->id) ?? $procedure;

            $teeth = Tooth::select('id', 'tooth_number', 'patient_id')
                ->where('patient_id', $procedure->patient_id)
                ->get();

            $services_category = ServiceCategory::with('services:category_id,id,name')
                ->select('id', 'name')->latest('name')
                ->get();

            return Inertia::render('Procedures/Edit', [
                'procedure' => $procedure,
                'teeth' => $teeth,
                'services_category' => $services_category,
            ]);

    }


    public function update(ProcedureUpdateRequest $request, Procedure $procedure)
    {

        $data = ProcedureData::fromValidated($request->validated());


            $this->service->update($procedure, $data);

            $tooth = Tooth::select('tooth_number', 'id', 'patient_id')->find($data->tooth_id);

            return redirect()
                ->route('patients.details', $tooth->patient_id)
                ->with('success', 'Procedure updated successfully.');


    }

    public function destroy(Procedure $procedure)
    {

            $this->service->delete($procedure);
            return redirect()->route('procedure.index', $procedure->patient_id)->with('success', 'Procedure deleted successfully.');

    }

    public function getTeeth(Patient $patient)
    {
        $teeth = $patient->teeth()->select('id', 'tooth_number', 'status')->get();

        return response()->json(['teeth' => $teeth]);
    }
}
