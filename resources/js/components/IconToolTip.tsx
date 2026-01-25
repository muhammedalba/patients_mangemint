import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { forwardRef } from 'react';

interface IconTooltipProps {
  label: string
  children: React.ReactNode
className?: string
}

export const IconTooltip = forwardRef<HTMLButtonElement, IconTooltipProps>(
  ({ label, children, className, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild ref={ref} {...props}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          className={`rounded-md bg-gray-500 px-3 py-1.5 text-xs text-white shadow-lg ${className ?? ""}`}
        >
          <p className="font-medium">{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
