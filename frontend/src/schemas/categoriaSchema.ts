import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["RECEITA", "DESPESA"], {
    message: "Selecione o tipo da categoria",
  }),
  cor: z.string().min(1, "Selecione uma cor"),
  icon: z.string().min(1, "Selecione um ícone"),
});

export type CategoriaFormValues = z.infer<typeof categoriaSchema>;
