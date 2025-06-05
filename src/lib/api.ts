import {AtivoFinanceiro, Cliente, ClienteFormData} from "@/lib/types";
import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const buscarClientes = async (): Promise<Cliente[]> => {
    const response = await apiClient.get('/clientes');
    return response.data.dados;
};

export const criarCliente = async (data: ClienteFormData): Promise<Cliente> => {
    const response = await apiClient.post('/clientes/criar', data);
    return response.data;
};

export const atualizarCliente = async (id: string, data: Partial<ClienteFormData>): Promise<Cliente> => {
    const response = await apiClient.patch(`/clientes/atualizar/${id}`, data);
    return response.data;
};

export const buscarAtivosFinanceiros = async (): Promise<AtivoFinanceiro[]> => {
    const response = await apiClient.get('/ativos-financeiros');
    return response.data.dados;
};

export const buscarAtivosFinanceirosPorCliente = async (clienteId: string): Promise<AtivoFinanceiro[]> => {
    const response = await apiClient.get(`/ativos-financeiros/cliente`, {
        params: { clienteId }
    });
    return response.data.dados;
};