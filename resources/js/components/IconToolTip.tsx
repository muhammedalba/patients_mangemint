import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface IconTooltipProps {
  label: string
  children: React.ReactNode
className?: string
}

export function IconTooltip({ label, children, className  }: IconTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent  className={`rounded-md bg-gray-500 px-3 py-1.5 text-xs text-white shadow-lg ${className ?? ""}`}>
        <p className="font-medium">{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
