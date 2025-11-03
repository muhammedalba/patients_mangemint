import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface ConfirmDialogProps {
  trigger: React.ReactNode
  message: string
  onConfirm: () => void
}

export default function ConfirmDialog({ trigger, message, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{message}</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <button className="px-2 py-1 text-xs bg-gray-200 rounded">Cancel</button>
          </DialogClose>
          <DialogClose asChild>
            <button
              onClick={onConfirm}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded"
            >
              Confirm
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
