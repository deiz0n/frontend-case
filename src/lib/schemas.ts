import { z } from 'zod';

export const clienteFormSchema = z.object({
    nome: z.string().nonempty(
        { message: "O campo nome é obrigatório" }
    ).min(10,
        { message: "Nome deve ter pelo menos 10 caracteres." }
    ),
    email: z.string().nonempty(
        { message: "O campo email é obrigatório"}
    ).email(
        { message: "Email inválido." }
    ),
    status: z.enum(['ATIVO', 'INATIVO'], { message: "Status inválido." }),
    ativosFinanceiros: z.array(z.any())
})