import { z } from "zod";

export const transacaoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["RECEITA", "DESPESA"], {
    message: "Selecione o tipo da transação",
  }),
  valor: z.coerce.number().positive("Valor deve ser positivo"),
  categoria: z.coerce
    .number({ message: "Selecione uma categoria" })
    .min(1, "Selecione uma categoria"),
  recorrencia: z.boolean(),
  dataTransacao: z.date({ message: "Selecione uma data" }),
  descricao: z.string().optional(),
});

export type TransacaoFormValues = z.infer<typeof transacaoSchema>;
