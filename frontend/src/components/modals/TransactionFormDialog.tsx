import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
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
import { Switch } from "../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calendar";

import {
  transacaoSchema,
  type TransacaoFormValues,
} from "../../schemas/transacaoSchema";
import { transacaoService } from "../../services/transacaoService";
import { useCategorias } from "../../hooks/useCategorias";
import type { TipoTransacao, Transacao } from "../../types/finance";
import { getApiErrorMessage } from "../../lib/api-error";

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipoInicial: TipoTransacao;
  transacaoEditando?: Transacao | null;
  onSuccess?: () => void;
}

export default function TransactionFormDialog({
  open,
  onOpenChange,
  tipoInicial,
  transacaoEditando = null,
  onSuccess,
}: TransactionFormDialogProps) {
  const isEdicao = !!transacaoEditando;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { categorias, isLoading: isLoadingCategorias } = useCategorias();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransacaoFormValues>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: {
      tipo: tipoInicial,
      recorrencia: false,
      dataTransacao: new Date(),
    },
  });

  const tipoAtual = useWatch({ control, name: "tipo" }) ?? tipoInicial;

  // Sempre que o modal abrir, reseta o form: com os dados da transação
  // (modo edição) ou com o tipo do botão clicado (modo criação).
  useEffect(() => {
    if (open) {
      reset(
        transacaoEditando
          ? {
              nome: transacaoEditando.nome,
              tipo: transacaoEditando.tipo,
              valor: transacaoEditando.valor,
              categoria: transacaoEditando.categoriaId,
              recorrencia: transacaoEditando.recorrencia,
              dataTransacao: new Date(transacaoEditando.data),
              descricao: transacaoEditando.descricao ?? "",
            }
          : {
              nome: "",
              tipo: tipoInicial,
              valor: undefined,
              categoria: undefined,
              recorrencia: false,
              dataTransacao: new Date(),
              descricao: "",
            },
      );
    }
  }, [open, tipoInicial, transacaoEditando, reset]);

  const categoriasFiltradas = categorias.filter((c) => c.tipo === tipoAtual);

  async function onSubmit(values: TransacaoFormValues) {
    setSubmitError(null);
    try {
      const payload = {
        nome: values.nome,
        tipo: values.tipo,
        valor: values.valor,
        categoria: values.categoria,
        recorrencia: values.recorrencia,
        dataTransacao: format(values.dataTransacao, "yyyy-MM-dd"),
        descricao: values.descricao || undefined,
      };

      if (isEdicao && transacaoEditando) {
        await transacaoService.update(transacaoEditando.id, payload);
      } else {
        await transacaoService.create(payload);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(
          error,
          "Não foi possível salvar a transação. Revise os dados e tente novamente.",
        ),
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdicao
              ? "Editar transação"
              : tipoAtual === "RECEITA"
                ? "Nova receita"
                : "Nova despesa"}
          </DialogTitle>
          <DialogDescription>
            {isEdicao
              ? "Atualize os dados da transação."
              : `Preencha os dados da ${tipoAtual === "RECEITA" ? "receita" : "despesa"}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {submitError && <p className="rounded-[4px] bg-secondary p-3 text-sm text-negative" role="alert">{submitError}</p>}
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
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Ex: Supermercado"
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-xs text-negative">{errors.nome.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0,00"
                {...register("valor")}
              />
              {errors.valor && (
                <p className="text-xs text-negative">{errors.valor.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Controller
                name="categoria"
                control={control}
                render={({ field }) => {
                  const categoriaAtual = categoriasFiltradas.find(
                    (c) => c.id === field.value,
                  );

                  return (
                    <Select
                      value={field.value ? String(field.value) : undefined}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={isLoadingCategorias}
                    >
                      <SelectTrigger>
                        <span
                          className={
                            categoriaAtual ? "" : "text-muted-foreground"
                          }
                        >
                          {categoriaAtual ? categoriaAtual.nome : "Selecione"}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {categoriasFiltradas.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.categoria && (
                <p className="text-xs text-negative">
                  {errors.categoria.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Controller
              name="dataTransacao"
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
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dataTransacao && (
              <p className="text-xs text-negative">
                {errors.dataTransacao.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-[4px] border p-3">
            <div>
              <Label htmlFor="recorrencia">Recorrente</Label>
              <p className="text-xs text-muted-foreground">
                Repete automaticamente todo mês
              </p>
            </div>
            <Controller
              name="recorrencia"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="recorrencia"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              placeholder="Detalhes adicionais..."
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
                  : tipoAtual === "RECEITA"
                    ? "Salvar receita"
                    : "Salvar despesa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
