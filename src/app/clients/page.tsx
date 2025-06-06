"use client";

import {AxiosError} from "axios";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { buscarClientes, criarCliente, atualizarCliente, buscarAtivosFinanceirosPorCliente } from '@/lib/api';
import { Cliente, ClienteFormData } from '@/lib/types';
import Link from 'next/link';

import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { ClienteCard } from '@/components/clients/ClienteCard';
import { ClienteForm } from '@/components/clients/ClientsForm';
import { ClienteDetailCard } from '@/components/clients/ClienteDetailCard';

import { Search, Plus, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ClientsPage() {
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<(Cliente | Partial<ClienteFormData>) | null>(null);

    const { data: clients, isLoading, error } = useQuery<Cliente[], Error>(
        ['clients'],
        buscarClientes
    );

    const createClientMutation = useMutation(criarCliente, {
        onSuccess: () => {
            queryClient.invalidateQueries(['clients']);
            setIsAddModalOpen(false);
            toast.success("Cliente adicionado com sucesso.");
        },
        onError: (err: any) => {
            const axiosError = err as AxiosError<any>;
            const mensagemErro = axiosError.response?.data?.mensagem ||
                axiosError.response?.data?.detalhes ||
                axiosError.message ||
                "Erro desconhecido";

            toast.error(`Falha ao adicionar cliente: ${mensagemErro}`);
            console.error("Detalhes completos do erro:", axiosError.response?.data);
        },
    });

    const updateClientMutation = useMutation(
        (data: { id: string; clientData: Partial<ClienteFormData> }) =>
            atualizarCliente(data.id, data.clientData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['clients']);
                queryClient.invalidateQueries(['ativosFinanceirosPorCliente']);
                setIsEditModalOpen(false);
                setSelectedClient(null);
                toast.success("Cliente atualizado com sucesso.");
            },
            onError: (err: any) => {
                const axiosError = err as AxiosError<any>;
                const mensagemErro = axiosError.response?.data?.mensagem ||
                    axiosError.response?.data?.detalhes ||
                    axiosError.message ||
                    "Erro desconhecido";

                toast.error(`Falha ao atualizar cliente: ${mensagemErro}`);
            },
        }
    );

    const handleAddClientSubmit = (data: ClienteFormData) => {
        const formattedData = {
            nome: data.nome,
            email: data.email,
            status: data.status,
            ativos: Array.isArray(data.ativosFinanceiros)
                ? data.ativosFinanceiros.map(String)
                : []
        };

        createClientMutation.mutate(formattedData);
    };

    const handleEditClientSubmit = (data: ClienteFormData) => {
        if (selectedClient && 'id' in selectedClient) {
            const ativosIds = Array.isArray(data.ativosFinanceiros)
                ? data.ativosFinanceiros.map(String)
                : [];

            const formattedData = {
                nome: data.nome,
                email: data.email,
                status: data.status,
                ativos: ativosIds
            };

            updateClientMutation.mutate({
                id: selectedClient.id,
                clientData: formattedData
            });
        }
    };

    const openEditModal = async (client: Cliente) => {
        try {
            const ativosDoCliente = await buscarAtivosFinanceirosPorCliente(client.id);

            const defaultValues = {
                ...client,
                ativosFinanceiros: ativosDoCliente.map(ativo => ativo.id)
            };

            setSelectedClient(defaultValues);
            setIsEditModalOpen(true);
        } catch (error) {
            toast.error("Erro ao carregar ativos do cliente");
        }
    };

    const openViewModal = (client: Cliente) => {
        setSelectedClient(client);
        setIsViewModalOpen(true);
    };

    const filteredClients = clients?.filter(client =>
        client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];


    if (isLoading) return <div className="text-center py-10">Carregando clientes...</div>;
    if (error) return (
        <div className="text-center py-10 text-red-600">
            <AlertTriangle size={48} className="mx-auto mb-2" />
            Erro ao carregar clientes: {error.message}
        </div>
    );

    return (
        <div>
            <div className="mb-4">
                <Link href="/">
                    <Button variant="outline" size="sm" className="mb-4 cursor-pointer">
                        <ArrowLeft size={16} className="mr-2" />
                        Voltar para a página inicial
                    </Button>
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Gerenciamento de Clientes</h1>
                <p className="text-gray-600">Adicione, visualize e edite informações dos seus clientes.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="Buscar clientes por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
            </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                    <Plus size={20} className="mr-2" />
                    Adicionar Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full w-[95vw] sm:max-w-lg p-2 sm:p-6 max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto flex-1">
                    <ClienteForm
                        onSubmit={handleAddClientSubmit}
                        onCancel={() => setIsAddModalOpen(false)}
                        isSubmitting={createClientMutation.isLoading}
                    />
                </div>
            </DialogContent>
        </Dialog>
    </div>

    {filteredClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                    <ClienteCard
                        key={client.id}
                        client={client}
                        onEdit={openEditModal}
                        onView={openViewModal}
                    />
    ))}
        </div>
    ) : (
        <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
            {searchTerm ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}
            </p>
            </div>
    )}

    {selectedClient && (
        <Dialog open={isEditModalOpen} onOpenChange={(isOpen) => {
        setIsEditModalOpen(isOpen);
        if (!isOpen) setSelectedClient(null);
    }}>
            <DialogContent className="max-w-full w-[95vw] sm:max-w-lg p-2 sm:p-6 max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Editar Cliente: {selectedClient.nome}</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto flex-1">
                    <ClienteForm
                        onSubmit={handleEditClientSubmit}
                        onCancel={() => { setIsEditModalOpen(false); setSelectedClient(null); }}
                        defaultValues={selectedClient}
                        isSubmitting={updateClientMutation.isLoading}
                    />
                </div>
            </DialogContent>
            </Dialog>
        )}

            <ClienteDetailCard
                client={selectedClient && 'id' in selectedClient ? selectedClient as Cliente : null}
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setSelectedClient(null); }}
            />
    </div>
);
}