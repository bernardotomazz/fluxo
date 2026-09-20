import { NavLink } from "react-router-dom";
import { ArrowLeftRight, LayoutDashboard, Tags, Target } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", title: "Visão geral", icon: LayoutDashboard },
  { path: "/transacoes", title: "Transações", icon: ArrowLeftRight },
  { path: "/categorias", title: "Categorias", icon: Tags },
  { path: "/metas", title: "Metas", icon: Target },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col border-r bg-background md:flex">
      <div className="flex h-[72px] items-center border-b px-5">
        <span className="text-xl font-bold">Fluxo</span>
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ path, title, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-[4px] px-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`
            }
          >
            <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
            {title}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-4 text-xs leading-4 text-muted-foreground">
        <p className="font-semibold text-foreground">API local</p>
        <p>Seus dados ficam no seu ambiente.</p>
      </div>
    </aside>
  );
}
