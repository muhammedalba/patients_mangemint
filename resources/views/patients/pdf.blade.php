<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>فاتورة المريض</title>

    <style>
        body {
            font-family: Helvetica, Arial, sans-serif;
            color: #444;
            background: #f7f7f7;
        }

        .invoice-box {
            direction: rtl;
            max-width: 850px;
            margin: 40px auto;
            padding: 40px;
            background: #fff;
            border: 1px solid #eee;
            box-shadow: 0 0 12px rgba(0, 0, 0, .08);
            font-size: 14px;
            line-height: 22px;
        }

        h2,
        h3 {
            margin: 0 0 10px;
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            padding: 6px 0;
            vertical-align: top;
        }

        .text-right {
            text-align: right;
        }

        .muted {
            color: #888;
            font-size: 13px;
        }

        .section {
            margin-top: 30px;
        }

        .heading td {
            background: #f0f0f0;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            padding: 8px;
        }

        .item td {
            border-bottom: 1px solid #eee;
            padding: 8px;
        }

        .total-row td {
            border-top: 2px solid #ddd;
            font-weight: bold;
            padding-top: 10px;
        }
    </style>
</head>

<body>

    <div className="invoice-box">

        {{-- Header --}}
        <table>
            <tr>
                <td>
                    <h2>فاتورة</h2>
                    <div class="muted">
                        تاريخ إصدار الفاتورة : {{ now()->format('Y-m-d') }}
                    </div>
                </td>
                <td class="text-right">
                    <strong>رقم #</strong> {{ $patientDetails['id'] }}
                </td>
            </tr>
        </table>

        {{-- Patient Information --}}
        <div class="section">
            <h3>بيانات المريض </h3>
            <table>
                <tr>
                    <td>
                        <strong>{{ $patientDetails['name'] }}</strong><br>
                        {!! nl2br(e($patientDetails['address'])) !!}<br>
                        {{ $patientDetails['email'] }}<br>
                        {{ $patientDetails['phone'] }}
                    </td>
                </tr>
            </table>
        </div>

        {{-- Procedures --}}
        <div class="section">
            <h3>إجراءات المريض</h3>
            <table>
                <tr class="heading">
                    <td>الوصف</td>
                    <td class="text-right">التكلفة</td>
                </tr>

                @forelse($patientDetails['procedures'] as $procedure)
                    <tr class="item">
                        <td>
                            {{ $procedure->name }}<br>
                            <span class="muted">
                                {{ optional($procedure->processing_date)->format('Y-m-d') }}
                            </span>
                        </td>
                        <td class="text-right">
                            ${{ number_format($procedure->cost, 2) }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="2" class="muted"> لا يوجد إجراءات مسجلة
                    </tr>
                @endforelse
            </table>
        </div>

        {{-- Payments --}}
        <div class="section">
            <h3>الدفعات</h3>
            <table>
                <tr class="heading">
                    <td>تاريخ الدفعة</td>
                    <td class="text-right">المبلغ</td>
                </tr>

                @forelse($patientDetails['payments'] as $payment)
                    <tr class="item">
                        <td>{{ $payment->payment_date }}</td>
                        <td class="text-right">
                            ${{ number_format($payment->amount, 2) }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="2" class="muted">لا يوجد دفعات حتى الإن</td>
                    </tr>
                @endforelse
            </table>
        </div>

        {{-- Financial Summary --}}
        <div class="section">
            <h3>الخلاصة المالية </h3>
            <table>
                <tr>
                    <td>إجمالي كلفة الإجراءات</td>
                    <td class="text-right">
                        ${{ number_format($patientDetails['financial_summary']['total_procedures_cost'], 2) }}
                    </td>
                </tr>
                <tr>
                    <td>قيمة الخصم</td>
                    <td class="text-right">
                        ${{ number_format($patientDetails['financial_summary']['discount_amount'], 2) }}
                    </td>
                </tr>
                <tr>
                    <td>المبلغ بعد الخصم</td>
                    <td class="text-right">
                        ${{ number_format($patientDetails['financial_summary']['total_procedures_after_discount'], 2) }}
                    </td>
                </tr>
                <tr>
                    <td>إجمالي المبلغ الدفوع</td>
                    <td class="text-right">
                        ${{ number_format($patientDetails['financial_summary']['total_payments'], 2) }}
                    </td>
                </tr>
                <tr class="total-row">
                    <td>المبلغ المتبقي في حساب المريض</td>
                    <td class="text-right">
                        ${{ number_format($patientDetails['financial_summary']['remaining_balance'], 2) }}
                    </td>
                </tr>
            </table>
        </div>

    </div>

</body>

</html>
