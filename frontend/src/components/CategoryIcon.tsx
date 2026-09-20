import { createElement } from "react";
import { Tag, type LucideProps } from "lucide-react";
import { CATEGORY_ICON_MAP } from "../lib/category-options";

export default function CategoryIcon({ name, ...props }: LucideProps & { name?: string }) {
  return createElement((name && CATEGORY_ICON_MAP[name]) || Tag, props);
}
