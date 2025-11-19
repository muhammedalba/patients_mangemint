import { Spinner } from "./ui/spinner";

interface FormButtonProps {
  processing: boolean;
  label: string;
  loadingLabel?: string;
}

export function FormButton({
  processing,
  label,
  loadingLabel = "جارِ الحفظ...",
}: FormButtonProps) {
  return (
    <button
      type="submit"
      disabled={processing}
      className={`flex items-center justify-center text-center gap-2 rounded-lg px-6 py-2 font-semibold text-white transition-all duration-200 ${
        processing
          ? "cursor-not-allowed bg-blue-400"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {processing && <Spinner color="white" />}
      <span>{processing ? loadingLabel : label}</span>
    </button>
  );
}
