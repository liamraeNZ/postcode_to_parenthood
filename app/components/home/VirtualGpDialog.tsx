import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface VirtualGpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  onCancel: () => void;
}

export default function VirtualGpDialog({ open, onOpenChange, onContinue, onCancel }: VirtualGpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Online GP service detected</DialogTitle>
          <DialogDescription>
            Your GP practice is an online (virtual) service. The funding information we show you is based on where your GP practice is formally registered with the NHS — not your home address.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-ink/70 leading-relaxed">
          Because online GP services like GP at Hand are registered in a specific area, your NHS funding entitlement is determined by that area's Integrated Care Board (ICB). This may differ from the ICB that covers your home postcode.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            className="text-sm"
            onClick={onCancel}
          >
            Find a local GP instead
          </Button>
          <Button
            className="bg-tint text-white hover:bg-tint/90 text-sm"
            onClick={onContinue}
          >
            I understand, continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
