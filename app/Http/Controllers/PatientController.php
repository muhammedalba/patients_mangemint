<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatientStoreRequest;
use App\Http\Requests\PatientUpdateRequest;
use Inertia\Inertia;
use App\Models\Patient;

class PatientController extends Controller
{
    public function index()
    {
        // جلب النص المكتوب في مربع البحث من الـ query string
        $search = request()->query('search');

        // استعلام ديناميكي مع البحث والبجينيشن
        $patients = Patient::query()
            // اختياري: حدد الأعمدة التي تحتاجها
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('id', 'desc') // ترتيب تنازلي حسب آخر مريض مضاف
            ->paginate(10) // 10 عناصر في كل صفحة
            ->withQueryString(); // يحتفظ بكلمة البحث أثناء التنقل بين الصفحات

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'filters' => request()->only(['search']),
        ]);
        // $patients = Patient::all();
        // return Inertia::render('Patients/Index', ['patients' => $patients]);
    }


    public function create()
    {
        return Inertia::render('Patients/Create');
    }

    public function store(PatientStoreRequest $request)
    {
        Patient::create($request->validated());
        return redirect()->route('patients.index');
    }

    public function edit(Patient $patient)
    {
        return Inertia::render('Patients/Edit', ['patient' => $patient]);
    }

    public function update(PatientUpdateRequest $request, Patient $patient)
    {
        $patient->update($request->validated());
        return redirect()->route('patients.index');
    }



    // show patient details , 'procedures'
    public function show(Patient $patient, $tooth = null)
    {
        $patient->load('teeth');
        $toothWithProcedures = null;
        if ($tooth) {
            $toothWithProcedures = $patient->teeth()->where('id', $tooth)->with('procedures')->first();
        }

        return Inertia::render('Patients/Show', [
            'patient' => $patient,
            'tooth' => $toothWithProcedures,
        ]);
    }








    public function destroy(Patient $patient)
    {
        $patient->delete();
        return redirect()->route('patients.index');
    }
}
