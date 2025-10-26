<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\MedicalRecord;
use App\Models\Patient;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function index()
    {
        $records = MedicalRecord::with('patient')->get();
        return Inertia::render('MedicalRecords/Index', ['records' => $records]);
    }

    public function create()
    {
        $patients = Patient::all();
        return Inertia::render('MedicalRecords/Create', compact('patients'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'notes' => 'required|string',
        ]);

        MedicalRecord::create($request->all());
        return redirect()->route('medical-records.index');
    }

    public function edit(MedicalRecord $medicalRecord)
    {
        $patients = Patient::all();
        return Inertia::render('MedicalRecords/Edit', ['record' => $medicalRecord, 'patients' => $patients]);
    }

    public function update(Request $request, MedicalRecord $medicalRecord)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'notes' => 'required|string',
        ]);

        $medicalRecord->update($request->all());
        return redirect()->route('medical-records.index');
    }

    public function destroy(MedicalRecord $medicalRecord)
    {
        $medicalRecord->delete();
        return redirect()->route('medical-records.index');
    }
}
