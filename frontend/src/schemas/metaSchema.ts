import { z } from "zod";

export const metaSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  valorMeta: z.coerce.number().positive("O valor da meta deve ser positivo"),
  prazo: z.date({ message: "Selecione um prazo" }),
});

export type MetaFormValues = z.infer<typeof metaSchema>;
