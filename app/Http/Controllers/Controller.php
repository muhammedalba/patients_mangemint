<?php

namespace App\Http\Controllers;

abstract class Controller
{
    //
}

    //     // جلب الأسنان الخاصة بالمريض إن وجد، وإلا جلب جميع الأسنان
    //     $teeth = $patientId
    //         ? Tooth::where('patient_id', $patientId)->get()
    //         : Tooth::all();
    //     if ($tooth_id) {
    //         $teeth = Tooth::where('id', $tooth_id)->get();
    //     };

    //     // جلب جميع المرضى لعرضهم في القائمة المنسدلة مثلًا
    //     $patients = Patient::select('id', 'name')->get();

    //     return Inertia::render('Procedures/Create', [
    //         'teeth' => $teeth,
    //         'patient_id' => $patientId,
    //         'patients' => $patients,
    //     ]);
    // }
