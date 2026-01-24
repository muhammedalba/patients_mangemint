import { cn } from "@/lib/utils";

export function Alert({ className, variant = "default", ...props }: { className?: string; variant?: "default" | "destructive"; children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className={cn(
        "w-full rounded-md border p-4 flex gap-3",
        variant === "destructive" && "border-red-500 bg-red-50 text-red-700",
        className
      )}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <h5 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  );
}

export function AlertDescription({ className, ...props }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("text-sm opacity-90", className)} {...props} />
  );
}
