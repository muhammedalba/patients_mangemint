<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
    <meta charset="UTF-8">
    <title>فاتورة المريض - مركز زيركون</title>

    <style>
        @page {
            margin: 0;
        }

        body {
            font-family: 'Cairo', dejavusans, sans-serif;
            direction: rtl;
            text-align: right;
            color: #1e293b;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }

        .container {
            padding: 40px;
        }

        /* Branding Header */
        .header {
            background-color: #0d9488; /* Teal 600 */
            color: white;
            padding: 40px;
            margin-bottom: 40px;
        }

        .header-table {
            width: 100%;
        }

        .brand-name {
            font-size: 32px;
            font-weight: bold;
            margin: 0;
        }

        .brand-tagline {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 5px;
        }

        .invoice-title {
            font-size: 40px;
            font-weight: 300;
            text-align: left;
            margin: 0;
        }

        /* Info Sections */
        .info-grid {
            width: 100%;
            margin-bottom: 40px;
        }

        .info-box {
            width: 50%;
            vertical-align: top;
        }

        .section-label {
            color: #64748b;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8px;
            display: block;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
        }

        .info-content {
            font-size: 15px;
            line-height: 1.6;
        }

        .info-content strong {
            font-size: 18px;
            color: #0f172a;
        }

        /* Table Styling */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }

        .data-table th {
            background-color: #f1f5f9;
            color: #475569;
            text-align: right;
            padding: 12px 15px;
            font-size: 13px;
            font-weight: bold;
            border-bottom: 2px solid #e2e8f0;
        }

        .data-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
        }

        .text-left {
            text-align: left !important;
        }

        .date-text {
            color: #94a3b8;
            font-size: 12px;
        }

        /* Summary Section */
        .summary-wrapper {
            width: 100%;
        }

        .summary-table {
            width: 300px;
            float: left;
            border-collapse: collapse;
        }

        .summary-table td {
            padding: 10px 0;
            font-size: 14px;
            border-bottom: 1px solid #f1f5f9;
        }

        .summary-label {
            color: #64748b;
        }

        .summary-value {
            font-weight: bold;
            text-align: left;
        }

        .grand-total-box {
            background-color: #f0fdfa; /* Teal 50 */
            border: 1px solid #ccfbf1;
            padding: 20px;
            margin-top: 10px;
            color: #0d9488;
        }

        .grand-total-label {
            font-size: 14px;
            font-weight: bold;
        }

        .grand-total-amount {
            font-size: 28px;
            font-weight: 900;
            text-align: left;
            display: block;
            margin-top: 5px;
        }

        .footer {
            position: absolute;
            bottom: 40px;
            left: 40px;
            right: 40px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
        }
    </style>
</head>

<body>

    <div class="header">
        <table class="header-table">
            <tr>
                <td>
                    <div class="brand-name">مركز زيركون</div>
                    <div class="brand-tagline">لطب وتجميل الأسنان الحديث</div>
                </td>
                <td class="text-left">
                    <div class="invoice-title">فاتورة</div>
                    <div style="font-size: 14px; opacity: 0.8; margin-top: 10px;">
                        رقم الفاتورة: #{{ $patientDetails['id'] }} | {{ now()->format('Y/m/d') }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="container">
        {{-- Information Grid --}}
        <table class="info-grid">
            <tr>
                <td class="info-box">
                    <span class="section-label">مقدم الخدمة</span>
                    <div class="info-content">
                        <strong>مركز زيركون الطبي</strong><br>
                        المنطقة الطبية، الشارع الرئيسي<br>
                        هاتف: 0123456789<br>
                        البريد: info@zircon.com
                    </div>
                </td>
                <td class="info-box" style="padding-right: 40px;">
                    <span class="section-label">العميل (المريض)</span>
                    <div class="info-content">
                        <strong>{{ $patientDetails['name'] }}</strong><br>
                        هاتف: {{ $patientDetails['phone'] }}<br>
                        رقم الملف الداخلي: #{{ $patientDetails['id'] }}
                    </div>
                </td>
            </tr>
        </table>

        {{-- Procedures (Disabled but variables kept as requested) --}}
        {{-- 
        <div class="section-label">الإجراءات والخدمات</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>وصف الخدمة</th>
                    <th class="text-left">السعر</th>
                </tr>
            </thead>
            <tbody>
                @forelse($patientDetails['procedures'] as $procedure)
                    <tr>
                        <td>
                            {{ $procedure->name }}<br>
                            <span class="date-text">{{ optional($procedure->processing_date)->format('Y-m-d') }}</span>
                        </td>
                        <td class="text-left">${{ number_format($procedure->cost, 2) }}</td>
                    </tr>
                @empty
                    <tr><td colspan="2" style="text-align: center; color: #94a3b8;">لا توجد إجراءات مسجلة</td></tr>
                @endforelse
            </tbody>
        </table> 
        --}}

        {{-- Payments --}}
        <div class="section-label" style="margin-top: 30px;">سجل الدفعات المستلمة</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>تاريخ الدفعة</th>
                    <th class="text-left">المبلغ المدفوع</th>
                </tr>
            </thead>
            <tbody>
                @forelse($patientDetails['payments'] as $payment)
                    <tr>
                        <td>{{ $payment->payment_date }}</td>
                        <td class="text-left">${{ number_format($payment->amount, 2) }}</td>
                    </tr>
                @empty
                    <tr><td colspan="2" style="text-align: center; color: #94a3b8;">لا توجد دفعات مسجلة حتى الآن</td></tr>
                @endforelse
            </tbody>
        </table>

        {{-- Summary --}}
        <div class="summary-wrapper" style="margin-top: 40px;">
            <table class="summary-table">
                <tr>
                    <td class="summary-label">إجمالي التكلفة</td>
                    <td class="summary-value">${{ number_format($patientDetails['financial_summary']['total_procedures_cost'], 2) }}</td>
                </tr>
                <tr>
                    <td class="summary-label">الخصم الممنوح</td>
                    <td class="summary-value" style="color: #059669;">-${{ number_format($patientDetails['financial_summary']['discount_amount'], 2) }}</td>
                </tr>
                <tr>
                    <td class="summary-label">الإجمالي بعد الخصم</td>
                    <td class="summary-value">${{ number_format($patientDetails['financial_summary']['total_procedures_after_discount'], 2) }}</td>
                </tr>
                <tr>
                    <td class="summary-label">إجمالي المدفوعات</td>
                    <td class="summary-value">${{ number_format($patientDetails['financial_summary']['total_payments'], 2) }}</td>
                </tr>
            </table>
            
            <div style="clear: both;"></div>

            <div class="grand-total-box" style="width: 260px; float: left; margin-top: 20px;">
                <span class="grand-total-label">الرصيد المتبقي</span>
                <span class="grand-total-amount">
                    ${{ number_format($patientDetails['financial_summary']['remaining_balance'], 2) }}
                </span>
            </div>
        </div>

    </div>

    <div class="footer">
        شكرًا لاختياركم مركز زيركون لطب الأسنان. نتمنى لكم دوام الصحة والعافية.
        <br>
        هذه الفاتورة تم إصدارها آلياً وتعتبر سارية المفعول دون الحاجة لختم أو توقيع.
    </div>

</body>

</html>
