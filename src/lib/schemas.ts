import { z } from 'zod';

export const clienteFormSchema = z.object({
    nome: z.string().min(10, { message: "Nome deve ter pelo menos 10 caracteres." }),
    email: z.string().email({ message: "Email inválido." }),
    status: z.enum(['ativo', 'inativo'], { message: "Status inválido." }),
    ativosFinanceiros: z.array(z.string())
})