import { useRef } from "react";
import { CalendarDays, MoreVertical, Moon, Plus, Sun } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "../../contexts/app-contexts";
import type { TipoTransacao } from "../../types/finance";

interface HeaderProps {
  title: string;
  onNewTransaction: (tipo?: TipoTransacao) => void;
}

const formattedMonth = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
}).format(new Date());
const currentMonth = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

export default function Header({ title, onNewTransaction }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const actionsMenuRef = useRef<HTMLDetailsElement>(null);

  function selectTransactionType(tipo: TipoTransacao) {
    actionsMenuRef.current?.removeAttribute("open");
    onNewTransaction(tipo);
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b bg-background px-4 sm:px-6 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold leading-7 md:text-2xl md:font-bold">{title}</h1>
          <p className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex md:hidden">
            <CalendarDays size={13} aria-hidden="true" /> {currentMonth}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-2 hidden h-11 items-center gap-2 text-sm leading-none text-muted-foreground lg:flex">
          <CalendarDays size={16} aria-hidden="true" />
          <span>{currentMonth}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
          title={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
        >
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
        </Button>
        <Button className="hidden h-11 rounded-[4px] px-4 sm:flex" onClick={() => onNewTransaction()}>
          <Plus size={18} aria-hidden="true" />
          Nova transação
        </Button>
        <details ref={actionsMenuRef} className="relative hidden sm:block">
          <summary
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[4px] hover:bg-secondary"
            aria-label="Mais ações"
            title="Mais ações"
          >
            <MoreVertical size={19} aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-12 z-50 w-44 rounded-[4px] border bg-popover p-1 text-sm shadow-[0_8px_24px_rgba(0,0,0,0.12)]" role="menu">
            <button className="flex w-full items-center rounded-[4px] px-3 text-left hover:bg-secondary" role="menuitem" onClick={() => selectTransactionType("RECEITA")}>Nova receita</button>
            <button className="flex w-full items-center rounded-[4px] px-3 text-left hover:bg-secondary" role="menuitem" onClick={() => selectTransactionType("DESPESA")}>Nova despesa</button>
          </div>
        </details>
      </div>
    </header>
  );
}
