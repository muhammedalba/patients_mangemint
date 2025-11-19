<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Payment;
use App\Models\Patient;
use App\Domain\Payments\Services\PaymentService;
use App\Domain\Payments\DTOs\PaymentData;
use App\Http\Requests\PaymentStoreRequest;
use App\Http\Requests\PaymentUpdateRequest;

class PaymentController extends Controller
{
    public function __construct(private PaymentService $service) {}

    public function index()
    {
        $filters = request()->only('search');

        $payments = $this->service->getAllPayments($filters);
        return Inertia::render('Payments/Index', ['payments' => $payments]);
    }

    public function create()
    {
        // get all patients
        $patients = Patient::select('id', 'name')->latest('updated_at')->get();

        return Inertia::render('Payments/Create',  ['patients' => $patients,]);
    }

    public function store(PaymentStoreRequest $request)
    {
        $data = PaymentData::fromArray($request->validated());
        $this->service->createPayment($data);

        return redirect()->route('payments.index')->with('success', 'create deleted successfully.');
    }

    public function edit(Payment $payment)
    {
        // get  patient by id
        $patients = Patient::where('id', $payment->patient_id)
            ->select('id', 'name')
            ->latest('name')
            ->get();


        return Inertia::render('Payments/Edit', ['payment' => $payment, 'patients' => $patients]);
    }

    public function update(PaymentUpdateRequest $request, Payment $payment)
    {
        $data = PaymentData::fromArray($request->validated());
        $this->service->updatePayment($payment, $data);

        return redirect()->route('payments.index')->with('success', 'Patient Edit successfully.');
    }

    public function destroy(Payment $payment)
    {
        $this->service->deletePayment($payment);
        return redirect()->route('payments.index')->with('success', 'delete Edit successfully.');
    }
}
