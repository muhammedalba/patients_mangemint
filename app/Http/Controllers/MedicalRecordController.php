<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function index()
    {
        $search = request()->query('search');
        $records = MedicalRecord::with(['patient', 'doctor'])->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        })->orderBy('id', 'desc')
            ->paginate(10);
        return Inertia::render('MedicalRecords/Index', ['records' => $records,  'filters' => request()->only(['search']),]);
    }

    public function create()
    {
        $patients = Patient::all();
        $doctors = \App\Models\User::role('doctor')->get();
        return Inertia::render('MedicalRecords/Create', compact('patients', 'doctors'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'procedure_id' => 'nullable|exists:procedures,id',
            'doctor_id' => 'nullable|exists:users,id',
            'date' => 'required|date',
            'details' => 'required|string',
            'attachments' => 'nullable|string',
        ]);

        MedicalRecord::create($request->all());
        return redirect()->route('medicalrecords.index');
    }

    public function edit(MedicalRecord $medicalRecord)
    {
        $patients = Patient::all();
        $doctors = User::role('doctor')->get();
        return Inertia::render('MedicalRecords/Edit', ['record' => $medicalRecord, 'patients' => $patients, 'doctors' => $doctors]);
    }

    public function update(Request $request, MedicalRecord $medicalRecord)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'procedure_id' => 'nullable|exists:procedures,id',
            'doctor_id' => 'nullable|exists:users,id',
            'date' => 'required|date',
            'details' => 'required|string',
            'attachments' => 'nullable|string',
        ]);

        $medicalRecord->update($request->all());
        return redirect()->route('medicalrecords.index');
    }

    public function destroy(MedicalRecord $medicalRecord)
    {
        $medicalRecord->delete();
        return redirect()->route('medicalrecords.index');
    }
}
