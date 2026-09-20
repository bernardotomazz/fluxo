import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import type { Categoria, TransacaoFiltros } from "../../types/finance";

interface TransactionFiltersProps {
  filtros: TransacaoFiltros;
  onChange: (filtros: TransacaoFiltros) => void;
  categorias: Categoria[];
}

const TIPO_LABEL: Record<string, string> = {
  RECEITA: "Receita",
  DESPESA: "Despesa",
};

export default function TransactionFilters({
  filtros,
  onChange,
  categorias,
}: TransactionFiltersProps) {
  const categoriaAtual = categorias.find((c) => c.id === filtros.idCategoria);

  function limpar() {
    onChange({});
  }

  const temFiltroAtivo = Object.values(filtros).some(
    (v) => v !== undefined && v !== "",
  );

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <Input
        placeholder="Buscar por nome..."
        value={filtros.nome ?? ""}
        onChange={(e) =>
          onChange({ ...filtros, nome: e.target.value || undefined })
        }
        className="h-10 w-full min-w-0 text-sm"
      />

      <Select
        value={filtros.tipoTransacao ?? "all"}
        onValueChange={(value) =>
          onChange({
            ...filtros,
            tipoTransacao:
              value === "all" ? undefined : (value as "RECEITA" | "DESPESA"),
          })
        }
      >
        <SelectTrigger className="h-10 w-full min-w-0 text-sm">
          <span>
            {filtros.tipoTransacao ? TIPO_LABEL[filtros.tipoTransacao] : "Tipo"}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="RECEITA">Receita</SelectItem>
          <SelectItem value="DESPESA">Despesa</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filtros.idCategoria ? String(filtros.idCategoria) : "all"}
        onValueChange={(value) =>
          onChange({
            ...filtros,
            idCategoria: value === "all" ? undefined : Number(value),
          })
        }
      >
        <SelectTrigger className="h-10 w-full min-w-0 text-sm">
          <span>{categoriaAtual ? categoriaAtual.nome : "Categoria"}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categorias.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        aria-label="Data inicial"
        value={filtros.dataInicio ?? ""}
        onChange={(e) =>
          onChange({ ...filtros, dataInicio: e.target.value || undefined })
        }
        className="h-10 w-full min-w-0 text-sm"
      />
      <Input
        type="date"
        aria-label="Data final"
        value={filtros.dataFim ?? ""}
        onChange={(e) =>
          onChange({ ...filtros, dataFim: e.target.value || undefined })
        }
        className="h-10 w-full min-w-0 text-sm"
      />

      {temFiltroAtivo && (
        <Button
          variant="ghost"
          size="sm"
          onClick={limpar}
          className="col-span-full w-fit text-muted-foreground hover:text-foreground sm:col-span-1"
        >
          <X size={14} className="mr-1" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
