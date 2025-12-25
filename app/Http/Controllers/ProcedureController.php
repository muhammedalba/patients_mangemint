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
use Illuminate\Support\Facades\Log;

class ProcedureController extends Controller
{
    private ProcedureService $service;

    public function __construct(ProcedureService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        try {
            $search = $request->input('search');

            $procedures = $this->service->listProcedures($search, 10);

            $procedures->getCollection()->transform(function ($procedure) {
                return [
                    'id' => $procedure->id,
                    'tooth_id' => $procedure->tooth_id,
                    'description' => $procedure->description,
                    'tooth_number' => $procedure->tooth?->tooth_number,
                    'cost' => $procedure->cost,
                    'name' => $procedure->name,
                    'duration_minutes' => $procedure->duration_minutes,
                    'follow_up_days' => $procedure->follow_up_days,
                    'patient' => $procedure->tooth?->patient?->name,
                ];
            });

            return Inertia::render('Procedures/Index', ['procedures' => $procedures]);
        } catch (\Throwable $e) {
            Log::error('Failed to load procedures index page', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->back()
                ->with('error', __('Failed to load procedures index page'));
        }
        return redirect()
            ->back()
            ->with('error', __('Something went wrong while loading the procedures index page.'));
    }

    public function create(Request $request, $patient_id = null)
    {
        try {
            // تحديد معرّفات المريض والسن إن وُجدا
            $patientId = $patient_id ?? $request->query('patient_id');
            $toothId = $request->query('tooth_id');
            // @dd($patientId, $toothId);
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
        } catch (\Throwable $e) {
            Log::error('Failed to load procedure create page', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->back()
                ->with('error', __('Failed to load procedure create page'));
        }
        return redirect()
            ->back()
            ->with('error', __('Something went wrong while loading the procedure create page.'));
    }

    public function store(ProcedureStoreRequest $request)
    {
        try{
        $data = ProcedureData::fromValidated($request->validated());

        $this->service->create($data);

        return redirect()->route('patients.details', $data->patient_id)->with('success', 'Procedure created successfully.');}
        catch (\Throwable $e) {
            Log::error('Failed to create procedure', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' =>  $request->all(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', __('Something went wrong while creating the procedure.'));
        }

    }

    public function edit(Procedure $procedure)
    {
        try {
            // ensure we have the relations loaded via service to mirror repository behavior with patient
            // $procedure = $this->service->find($procedure->id) ?? $procedure;

            $teeth = Tooth::select('id', 'tooth_number', 'patient_id')
                ->where('patient_id', $procedure->tooth?->patient_id)
                ->get();

            $services_category = ServiceCategory::with('services:category_id,id,name')
                ->select('id', 'name')->latest('name')
                ->get();

            return Inertia::render('Procedures/Edit', [
                'procedure' => $procedure,
                'teeth' => $teeth,
                'services_category' => $services_category,
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to load procedure edit page', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'procedure_id' => $procedure->id,
            ]);

            return redirect()
                ->back()
                ->with('error', __('Failed to load procedure edit page'));
        }
        return redirect()
            ->back()
            ->with('error', __('Something went wrong while loading the procedure edit page.'));
    }


    public function update(ProcedureUpdateRequest $request, Procedure $procedure)
    {
        $data = ProcedureData::fromValidated($request->validated());
        try {
            $this->service->update($procedure, $data);

            $tooth = Tooth::select('tooth_number', 'id', 'patient_id')->find($data->tooth_id);

            return redirect()
                ->route('patients.details', $tooth->patient_id)
                ->with('success', 'Procedure updated successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to update procedure', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'procedure_id' => $procedure->id,
                'data' => $data->toArray(),
            ]);

            return back()->with('error', __('Failed to update procedure.'));
        }
        return back()->with('error', __('Something went wrong while updating the procedure.'));
    }

    public function destroy(Procedure $procedure)
    {
        try {
            $this->service->delete($procedure);
        } catch (\Throwable $e) {
            Log::error('Failed to delete procedure', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'procedure_id' => $procedure->id
            ]);

            return back()->with('error', __('Failed to delete procedure.'));
        }
        return back()->with('error', __('Something went wrong while delete procedure.'));
    }

    public function getTeeth(Patient $patient)
    {
        $teeth = $patient->teeth()->select('id', 'tooth_number', 'status')->get();

        return response()->json(['teeth' => $teeth]);
    }
}
