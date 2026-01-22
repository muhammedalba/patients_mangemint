import { FinancialSummary }  from "@/types";

interface FinancialSummaryProps {
  summary: FinancialSummary;
}
export default function FinancialSummaryForm ({ summary }: FinancialSummaryProps) {
  const rows = [
    { label: 'إجمالي تكلفة الإجراءات', value: summary.total_procedures_cost },
    { label: 'عدد الإجراءات', value: summary.total_procedures },
    { label: 'إجمالي بعد الخصم', value: summary.total_procedures_after_discount },
    { label: 'قيمة الخصم', value: summary.discount_amount },
    { label: 'إجمالي المدفوعات', value: summary.total_payments },
    { label: 'الرصيد المتبقي', value: summary.remaining_balance },
  ];

  return (
    <div className="shadow-md rounded-lg bg-white p-4 mt-2">
      <table className="w-full border-collapse rounded-lg overflow-hidden">
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              <td className="px-4 py-2 text-gray-600 font-medium border-b">
                {row.label}
              </td>
              <td className="px-4 py-2 text-gray-900 font-bold border-b text-right">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
