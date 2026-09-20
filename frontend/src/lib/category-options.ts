import {
  Car,
  Clapperboard,
  GraduationCap,
  HeartPulse,
  Home,
  MoreHorizontal,
  ShoppingCart,
  Tag,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Wallet,
  ShoppingCart,
  Car,
  Home,
  Clapperboard,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Tag,
};

export const CATEGORY_ICON_OPTIONS = [
  "Wallet",
  "ShoppingCart",
  "Car",
  "Home",
  "Clapperboard",
  "HeartPulse",
  "GraduationCap",
  "MoreHorizontal",
] as const;

export const CATEGORY_COLOR_TOKENS = [
  { name: "Verde", value: "#146B4A" },
  { name: "Positivo", value: "#087F5B" },
  { name: "Negativo", value: "#C63C32" },
  { name: "Atenção", value: "#8A5500" },
  { name: "Informação", value: "#276EF1" },
  { name: "Neutro", value: "#5E5E5E" },
] as const;
