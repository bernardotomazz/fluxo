import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import {
  categoriaSchema,
  type CategoriaFormValues,
} from "../../schemas/categoriaSchema";
import { categoriaService } from "../../services/categoriaService";
import type { CategoriaResumo, CategoriaRequest } from "../../types/finance";
import {
  CATEGORY_COLOR_TOKENS,
  CATEGORY_ICON_MAP,
  CATEGORY_ICON_OPTIONS,
} from "../../lib/category-options";
import CategoryIcon from "../CategoryIcon";
import { getApiErrorMessage } from "../../lib/api-error";

interface CategoriaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  categoriaEditando?: CategoriaResumo | null;
}

export default function CategoriaFormDialog({
  open,
  onOpenChange,
  onSuccess,
  categoriaEditando = null,
}: CategoriaFormDialogProps) {
  const isEdicao = !!categoriaEditando;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      tipo: "DESPESA",
      cor: CATEGORY_COLOR_TOKENS[0].value,
      icon: CATEGORY_ICON_OPTIONS[0],
    },
  });

  // Sempre que o modal abrir, reseta o form: com os dados da categoria
  // (modo edição) ou com valores padrão (modo criação).
  useEffect(() => {
    if (open) {
      reset(
        categoriaEditando
          ? {
              nome: categoriaEditando.nome,
              tipo: categoriaEditando.tipo,
              cor: categoriaEditando.cor,
              icon: categoriaEditando.icone,
            }
          : {
              nome: "",
              tipo: "DESPESA",
              cor: CATEGORY_COLOR_TOKENS[0].value,
              icon: CATEGORY_ICON_OPTIONS[0],
            },
      );
    }
  }, [open, categoriaEditando, reset]);

  const corSelecionada = useWatch({ control, name: "cor" });
  const iconeSelecionado = useWatch({ control, name: "icon" });
  const nomePreview = useWatch({ control, name: "nome" });

  async function onSubmit(values: CategoriaFormValues) {
    setSubmitError(null);
    try {
      const payload: CategoriaRequest = {
        nome: values.nome ?? "",
        tipo: values.tipo ?? "DESPESA",
        cor: values.cor ?? CATEGORY_COLOR_TOKENS[0].value,
        icon: values.icon ?? CATEGORY_ICON_OPTIONS[0],
      };

      if (isEdicao && categoriaEditando) {
        await categoriaService.update(categoriaEditando.id, payload);
      } else {
        await categoriaService.create(payload);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          "Não foi possível salvar a categoria. Revise os dados e tente novamente.",
        ),
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdicao ? "Editar categoria" : "Nova categoria"}
          </DialogTitle>
          <DialogDescription>
            {isEdicao
              ? "Atualize os dados da categoria."
              : "Crie uma categoria para organizar suas transações."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {submitError && <p className="rounded-[4px] bg-secondary p-3 text-sm text-negative" role="alert">{submitError}</p>}
          <div className="flex items-center gap-3 rounded-[4px] border p-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-secondary"
              style={{ backgroundColor: `${corSelecionada}20` }}
            >
              <CategoryIcon name={iconeSelecionado} size={18} style={{ color: corSelecionada }} />
            </div>
            <span className="text-sm font-medium">
              {nomePreview || "Nome da categoria"}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Ex: Alimentação"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-xs text-negative">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.onChange("RECEITA")}
                    className={
                      field.value === "RECEITA"
                        ? "border-positive bg-secondary text-positive"
                        : "hover:bg-secondary"
                    }
                  >
                    Receita
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.onChange("DESPESA")}
                    className={
                      field.value === "DESPESA"
                        ? "border-negative bg-secondary text-negative"
                        : "hover:bg-secondary"
                    }
                  >
                    Despesa
                  </Button>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <Controller
              name="cor"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_COLOR_TOKENS.map(({ name, value }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`h-9 w-9 rounded-[4px] transition-transform ${
                        field.value === value
                          ? "scale-105 ring-2 ring-ring ring-offset-2 ring-offset-background"
                          : ""
                      }`}
                      style={{ backgroundColor: value }}
                      aria-label={`Cor ${name}`}
                      title={name}
                    />
                  ))}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-8 gap-2">
                  {CATEGORY_ICON_OPTIONS.map((name) => {
                    const Icon = CATEGORY_ICON_MAP[name];
                    return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => field.onChange(name)}
                      className={`flex h-11 w-11 items-center justify-center rounded-[4px] border transition-colors ${
                        field.value === name
                          ? "border-accent bg-secondary text-accent"
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                      aria-label={`Ícone ${name}`}
                      title={name}
                    >
                      <Icon size={16} />
                    </button>
                  )})}
                </div>
              )}
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
