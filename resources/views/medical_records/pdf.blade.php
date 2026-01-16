<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medical Record</title>
    <style>
        body {
            font-family: dejavusans
            line-height: 1.6;
             direction: rtl;
        text-align: right;
            color: #333;
        }
        .container {
            width: 100%;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            text-align: center;
            color: #444;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section h2 {
            font-size: 1.2em;
            color: #555;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .label {
            font-weight: bold;
            width: 30%;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Medical Record</h1>

        <div class="section">
            <h2>Patient and Doctor Information</h2>
            <table>
                <tr>
                    <td class="label">Patient Name:</td>
                    <td>{{ $medicalRecord->patient->name }}</td>
                </tr>
                <tr>
                    <td class="label">Doctor Name:</td>
                    <td>{{ $medicalRecord->doctor->name ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td class="label">Record ID:</td>
                    <td>{{ $medicalRecord->id }}</td>
                </tr>
                <tr>
                    <td class="label">Date:</td>
                    <td>{{ $medicalRecord->created_at->format('Y-m-d') }}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>Dental and Medical History</h2>
            <table>
                <tr><td class="label">Chief Complaint:</td><td>{{ $medicalRecord->chief_complaint ?? 'N/A' }}</td></tr>
                <tr><td class="label">History of Present Illness:</td><td>{{ $medicalRecord->present_illness_history ?? 'N/A' }}</td></tr>
                <tr><td class="label">Past Dental History:</td><td>{{ $medicalRecord->past_dental_history ?? 'N/A' }}</td></tr>
            </table>
        </div>

        <div class="section">
            <h2>General Medical History</h2>
            <table>
                <tr><td class="label">Cardiovascular Disease:</td><td>{{ $medicalRecord->has_cardiovascular_disease ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Hypertension:</td><td>{{ $medicalRecord->has_hypertension ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Respiratory Disease:</td><td>{{ $medicalRecord->has_respiratory_disease ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Gastrointestinal Disease:</td><td>{{ $medicalRecord->has_gastrointestinal_disease ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Neural Disease:</td><td>{{ $medicalRecord->has_neural_disease ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Hepatic Disease:</td><td>{{ $medicalRecord->has_hepatic_disease ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Renal Disease:</td><td>{{ $medicalRecord->has_renal_disease ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Endocrine Disease:</td><td>{{ $medicalRecord->has_endocrine_disease ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Diabetes:</td><td>{{ $medicalRecord->has_diabetes ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Details on Medical Diseases:</td><td>{{ $medicalRecord->medical_disease_details ?? 'N/A' }}</td></tr>
            </table>
        </div>

        <div class="section">
            <h2>Allergies and Medications</h2>
            <table>
                <tr><td class="label">Allergic To:</td><td>{{ $medicalRecord->allergic_to ?? 'N/A' }}</td></tr>
                <tr><td class="label">Current Medications:</td><td>{{ $medicalRecord->current_medications ?? 'N/A' }}</td></tr>
            </table>
        </div>

        <div class="section">
            <h2>Special Conditions</h2>
            <table>
                <tr><td class="label">Hospitalized or Operated:</td><td>{{ $medicalRecord->hospitalized_or_operated ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Hospital Details:</td><td>{{ $medicalRecord->hospital_details ?? 'N/A' }}</td></tr>
                <tr><td class="label">Abnormal Bleeding History:</td><td>{{ $medicalRecord->abnormal_bleeding_history ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Is Pregnant:</td><td>{{ $medicalRecord->is_pregnant ? 'Yes' : 'No' }}</td></tr>
                <tr><td class="label">Pregnancy Trimester:</td><td>{{ $medicalRecord->pregnancy_trimester ?? 'N/A' }}</td></tr>
            </table>
        </div>

        <div class="section">
            <h2>Clinical Notes</h2>
            <p>{{ $medicalRecord->clinical_notes ?? 'No clinical notes available.' }}</p>
        </div>
    </div>
</body>
</html>
