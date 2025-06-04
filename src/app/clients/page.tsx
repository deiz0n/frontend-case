// app/clients/page.tsx
"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { buscarClientes, criarCliente, atualizarCliente } from '@/lib/api';
import { Cliente, ClienteFormData } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

import { ClienteCard } from '@/components/clients/ClienteCard';
import { ClienteForm } from '@/components/clients/ClientsForm';
import { ClienteDetalhesDialogo } from '@/components/clients/ClienteDetalhesDialogo';

import { Search, Plus, Edit, Eye, AlertTriangle } from 'lucide-react';

export default function ClientsPage() {
    const queryClient = useQueryClient();
    // const { toast } = useToast(); // Para notificações

    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

    // Busca de clientes [cite: 16]
    const { data: clients, isLoading, error } = useQuery<Cliente[], Error>(
        ['clients'], // Query key
        buscarClientes   // Fetch function
    );

    // Mutação para criar cliente [cite: 16]
    const createClientMutation = useMutation(criarCliente, {
        onSuccess: () => {
            queryClient.invalidateQueries(['clients']); // Invalida a query de clientes para refetch
            setIsAddModalOpen(false);
            // toast({ title: "Sucesso!", description: "Cliente adicionado com sucesso." });
        },
        onError: (err: Error) => {
            // toast({ variant: "destructive", title: "Erro!", description: `Falha ao adicionar cliente: ${err.message}` });
            console.error("Erro ao criar cliente:", err);
        },
    });

    // Mutação para editar cliente [cite: 16]
    const updateClientMutation = useMutation(
        (data: { id: string; clientData: Partial<ClienteFormData> }) => atualizarCliente(data.id, data.clientData), {
            onSuccess: () => {
                queryClient.invalidateQueries(['clients']);
                queryClient.invalidateQueries(['clientAllocations', selectedClient?.id]); // Se estiver visualizando detalhes
                setIsEditModalOpen(false);
                setSelectedClient(null);
                // toast({ title: "Sucesso!", description: "Cliente atualizado com sucesso." });
            },
            onError: (err: Error) => {
                // toast({ variant: "destructive", title: "Erro!", description: `Falha ao atualizar cliente: ${err.message}` });
                console.error("Erro ao editar cliente:", err);
            },
        });

    const handleAddClientSubmit = (data: ClienteFormData) => {
        createClientMutation.mutate(data);
    };

    const handleEditClientSubmit = (data: ClienteFormData) => {
        if (selectedClient) {
            updateClientMutation.mutate({ id: selectedClient.id, clientData: data });
        }
    };

    const openEditModal = (client: Cliente) => {
        setSelectedClient(client);
        setIsEditModalOpen(true);
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Gerenciamento de Clientes</h1>
                <p className="text-gray-600">Adicione, visualize e edite informações dos seus clientes.</p>
            </div>

    {/* Barra de Ações */}
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                </DialogHeader>
                <ClienteForm
                    onSubmit={handleAddClientSubmit}
                    onCancel={() => setIsAddModalOpen(false)}
                    isSubmitting={createClientMutation.isLoading}
                />
            </DialogContent>
        </Dialog>
    </div>

    {/* Grade de Clientes */}
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

    {/* Modal de Edição */}
    {selectedClient && (
        <Dialog open={isEditModalOpen} onOpenChange={(isOpen) => {
        setIsEditModalOpen(isOpen);
        if (!isOpen) setSelectedClient(null);
    }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Editar Cliente: {selectedClient.nome}</DialogTitle>
    </DialogHeader>
    <ClienteForm
        onSubmit={handleEditClientSubmit}
        onCancel={() => { setIsEditModalOpen(false); setSelectedClient(null); }}
        defaultValues={selectedClient}
        isSubmitting={updateClientMutation.isLoading}
        />
        </DialogContent>
        </Dialog>
    )}

    {/* Modal de Visualização de Detalhes */}
    <ClienteDetalhesDialogo
        client={selectedClient}
    isOpen={isViewModalOpen}
    onClose={() => { setIsViewModalOpen(false); setSelectedClient(null); }}
    />
    </div>
);
}