export interface Cliente {
    id: string;
    nome: string;
    email: string;
    status: 'ativo' | 'inativo';
    ativosFinanceiros: string[]
}

export interface AtivoFinanceiro {
    id: string;
    nome: string;
    valorAtual: number
}

export type ClienteFormData = Omit<Cliente, 'id'>;