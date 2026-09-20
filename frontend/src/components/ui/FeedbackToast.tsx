import { CheckCircle2, X } from "lucide-react";
import { useFeedback } from "../../contexts/app-contexts";
import { Button } from "./button";

export default function FeedbackToast() {
  const { message, dismiss } = useFeedback();

  if (!message) return null;

  return (
    <div
      className="fixed bottom-24 right-4 z-[90] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-[4px] border bg-popover p-3 text-sm text-popover-foreground shadow-[0_8px_24px_rgba(0,0,0,0.16)] md:bottom-6 md:right-6"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="shrink-0 text-positive" size={19} aria-hidden="true" />
      <span className="font-medium">{message}</span>
      <Button
        variant="ghost"
        size="icon"
        className="-mr-1 h-9 min-h-9 w-9"
        onClick={dismiss}
        aria-label="Fechar confirmação"
        title="Fechar"
      >
        <X size={17} aria-hidden="true" />
      </Button>
    </div>
  );
}
