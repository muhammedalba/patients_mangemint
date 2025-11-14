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
        $payments = $this->service->getAllPayments();
        return Inertia::render('Payments/Index', ['payments' => $payments]);
    }

    public function create()
    {
        // get all patients
        $patients = Patient::select('id', 'name')->orderBy('name', 'asc')->get();
        // @dd( $patients);
        return Inertia::render('Payments/Create',  ['patients' => $patients,]);
    }

    public function store(PaymentStoreRequest $request)
    {
        $data = PaymentData::fromArray($request->validated());
        $this->service->createPayment($data);

        return redirect()->route('payments.index');
    }

    public function edit(Payment $payment)
    {
        // get  patient by id
        $patients = Patient::where('id', $payment->patient_id)
            ->select('id', 'name')
            ->orderBy('name', 'asc')
            ->get();

        // $patients = Patient::select('id', 'name')->orderBy('name', 'asc')->get();
        return Inertia::render('Payments/Edit', ['payment' => $payment, 'patients' => $patients]);
    }

    public function update(PaymentUpdateRequest $request, Payment $payment)
    {
        $data = PaymentData::fromArray($request->validated());
        $this->service->updatePayment($payment, $data);

        return redirect()->route('payments.index');
    }

    public function destroy(Payment $payment)
    {
        $this->service->deletePayment($payment);
        return redirect()->route('payments.index');
    }
}
