import { useEffect, useState } from "react";

export default function Invoice({ patientId }: { patientId: string }) {
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    fetch(`/patients/${patientId}/download-invoice`)
      .then(res => res.json())
      .then(data => setInvoice(data));
  }, [patientId]);


  return (
    <div className="max-w-lg mx-auto border p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">فاتورة المريض</h2>

      <h3 className="font-semibold mt-4 mb-2">💵 الدفعات</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">التاريخ</th>
            <th className="p-2 border">المبلغ</th>
            <th className="p-2 border">طريقة الدفع</th>
          </tr>
        </thead>
        <tbody>
          {invoice.payments.map((p: any, i: number) => (
            <tr key={i}>
              <td className="p-2 border">{p.date}</td>
              <td className="p-2 border">{p.amount} ل.س</td>
              <td className="p-2 border">{p.method}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="font-semibold mt-4 mb-2">🩺 الإجراءات</h3>
      <ul className="list-disc pl-6">
        {invoice.procedures.map((proc: any, i: number) => (
          <li key={i}>{proc.date} - {proc.description}</li>
        ))}
      </ul>

      <div className="mt-6 text-right font-bold">
        المجموع: {invoice.payments.reduce((sum: number, p: any) => sum + p.amount, 0)} ل.س
      </div>
    </div>
  );
}
