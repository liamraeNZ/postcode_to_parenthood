import { cn } from "@/lib/utils";

interface VirtualGpNoteProps {
  className?: string;
}

export function VirtualGpNote({ className }: VirtualGpNoteProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-tint/20 bg-surface/50 px-4 py-3 text-sm text-ink/70 leading-relaxed",
        className
      )}
    >
      <p className="font-sans font-light">
        You're viewing this page based on your online GP's registered location, not your home address.
      </p>
    </div>
  );
}
