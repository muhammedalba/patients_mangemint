export default function FinancialSummary({ summary }) {
  return (
    <div className="shadow-md rounded-lg bg-gray-100 p-2">

      <div className="grid grid-rows-6 gap-1">
        <div>
          <span className="text-gray-500">إجمالي تكلفة الإجراءات:</span>
          <span className="text-lg font-bold text-gray-800">
            {summary.total_procedures_cost}
          </span>
        </div>

        <div>
          <span className="text-gray-500">عدد الإجراءات:</span>
          <span className="text-lg font-bold text-gray-800">
            {summary.total_procedures}
          </span>
        </div>

        <div>
          <span className="text-gray-500">إجمالي بعد الخصم:</span>
          <span className="text-lg font-bold text-gray-800">
            {summary.total_procedures_after_discount}
          </span>
        </div>

        <div>
          <span className="text-gray-500">قيمة الخصم:</span>
          <span className="text-lg font-bold text-gray-800">
            {summary.discount_amount}
          </span>
        </div>

        <div>
          <span className="text-gray-500">إجمالي المدفوعات:</span>
          <span className="text-lg font-bold text-gray-800">
            {summary.total_payments}
          </span>
        </div>

        <div>
          <span className="text-gray-500">الرصيد المتبقي:</span>
          <span className="text-lg font-bold text-gray-800">
            {summary.remaining_balance}
          </span>
        </div>
      </div>
    </div>
  );
}
