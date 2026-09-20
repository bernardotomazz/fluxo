import { NavLink } from "react-router-dom";
import { ArrowLeftRight, LayoutDashboard, Plus, Tags, Target } from "lucide-react";

const LEFT_ITEMS = [
  { path: "/", title: "Visão", icon: LayoutDashboard },
  { path: "/transacoes", title: "Transações", icon: ArrowLeftRight },
];

const RIGHT_ITEMS = [
  { path: "/categorias", title: "Categorias", icon: Tags },
  { path: "/metas", title: "Metas", icon: Target },
];

function MobileLink({ path, title, icon: Icon }: (typeof LEFT_ITEMS)[number]) {
  return (
    <NavLink
      to={path}
      end={path === "/"}
      className={({ isActive }) =>
        `flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium ${
          isActive ? "text-foreground" : "text-muted-foreground"
        }`
      }
    >
      <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
      <span className="max-w-full truncate">{title}</span>
    </NavLink>
  );
}

export default function MobileNavigation({ onNewTransaction }: { onNewTransaction: () => void }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-background px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Navegação principal"
    >
      {LEFT_ITEMS.map((item) => <MobileLink key={item.path} {...item} />)}
      <button
        type="button"
        onClick={onNewTransaction}
        className="mx-auto -mt-4 flex h-14 w-14 items-center justify-center rounded-[8px] bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
        aria-label="Nova transação"
      >
        <Plus size={26} aria-hidden="true" />
      </button>
      {RIGHT_ITEMS.map((item) => <MobileLink key={item.path} {...item} />)}
    </nav>
  );
}
