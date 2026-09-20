import { useState, type FormEvent } from "react";
import { CircleDollarSign } from "lucide-react";
import { metaService } from "../../services/metaService";
import { getApiErrorMessage } from "../../lib/api-error";
import type { Meta } from "../../types/finance";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

interface GoalContributionDialogProps {
  goal: Meta;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (goal: Meta) => void;
}

export default function GoalContributionDialog({
  goal,
  open,
  onOpenChange,
  onSuccess,
}: GoalContributionDialogProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const remaining = Math.max(goal.valorObjetivo - goal.valorAtual, 0);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setValue("");
      setError(null);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Informe um valor maior que zero.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const updatedGoal = await metaService.adicionarAporte(goal.id, amount);
      onSuccess(updatedGoal);
      handleOpenChange(false);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Não foi possível adicionar o valor à meta."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar valor</DialogTitle>
          <DialogDescription>
            Registre quanto você separou para “{goal.nome}”. Faltam {currency.format(remaining)}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="rounded-[4px] bg-secondary p-3 text-sm text-negative" role="alert">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="goal-contribution">Valor do aporte</Label>
            <div className="relative">
              <CircleDollarSign aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="goal-contribution"
                type="number"
                min="0.01"
                max={remaining}
                step="0.01"
                inputMode="decimal"
                className="pl-10"
                placeholder="0,00"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
