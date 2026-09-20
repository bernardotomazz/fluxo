import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";

import { metaSchema, type MetaFormValues } from "../../schemas/metaSchema";
import { metaService } from "../../services/metaService";
import type { Meta } from "../../types/finance";
import { getApiErrorMessage } from "../../lib/api-error";

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  metaEditando?: Meta | null;
}

export default function GoalFormDialog({
  open,
  onOpenChange,
  onSuccess,
  metaEditando = null,
}: GoalFormDialogProps) {
  const isEdicao = !!metaEditando;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MetaFormValues>({
    resolver: zodResolver(metaSchema),
  });

  // Sempre que o modal abrir, reseta o form: com os dados da meta
  // (modo edição) ou vazio (modo criação).
  useEffect(() => {
    if (open) {
      reset(
        metaEditando
          ? {
              titulo: metaEditando.nome,
              descricao: metaEditando.descricao ?? "",
              valorMeta: metaEditando.valorObjetivo,
              prazo: new Date(metaEditando.prazo),
            }
          : {
              titulo: "",
              descricao: "",
              valorMeta: undefined,
              prazo: undefined,
            },
      );
    }
  }, [open, metaEditando, reset]);

  async function onSubmit(values: MetaFormValues) {
    setSubmitError(null);
    try {
      const payload = {
        titulo: values.titulo,
        descricao: values.descricao || undefined,
        valorMeta: values.valorMeta,
        prazo: format(values.prazo, "yyyy-MM-dd"),
      };

      if (isEdicao && metaEditando) {
        await metaService.update(metaEditando.id, payload);
      } else {
        await metaService.create(payload);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          "Não foi possível salvar a meta. Revise os dados e tente novamente.",
        ),
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdicao ? "Editar meta" : "Nova meta"}</DialogTitle>
          <DialogDescription>
            {isEdicao
              ? "Atualize os dados da meta."
              : "Defina um objetivo financeiro para acompanhar."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {submitError && <p className="rounded-[4px] bg-secondary p-3 text-sm text-negative" role="alert">{submitError}</p>}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Ex: Viagem para o Japão"
              {...register("titulo")}
            />
            {errors.titulo && (
              <p className="text-xs text-negative">{errors.titulo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorMeta">Valor objetivo</Label>
            <Input
              id="valorMeta"
              type="number"
              step="0.01"
              placeholder="0,00"
              {...register("valorMeta")}
            />
            {errors.valorMeta && (
              <p className="text-xs text-negative">{errors.valorMeta.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Prazo</Label>
            <Controller
              name="prazo"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger className="flex h-11 w-full items-center rounded-[4px] border bg-transparent px-3 text-left text-sm font-normal hover:bg-secondary">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value
                      ? format(field.value, "dd/MM/yyyy")
                      : "Selecione uma data"}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.prazo && (
              <p className="text-xs text-negative">{errors.prazo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              placeholder="Detalhes sobre a meta..."
              {...register("descricao")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="hover:bg-secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Salvando..."
                : isEdicao
                  ? "Salvar alterações"
                  : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
