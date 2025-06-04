"use client";

import React from 'react';
import { Cliente, AtivoFinanceiro } from '@/lib/types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from 'react-query';
import { buscarAtivosFinanceiros } from '@/lib/api';
import { AlertCircle, Check } from 'lucide-react';

interface ClienteDetalhesDialogoProps {
    client: Cliente | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ClienteDetalhesDialogo: React.FC<ClienteDetalhesDialogoProps> = ({ client, isOpen, onClose }) => {
    const {
        data: ativos,
        isLoading,
        error
    } = useQuery<AtivoFinanceiro[], Error>(
        'ativosFinanceiros',
        buscarAtivosFinanceiros,
        { enabled: isOpen }
    );

    if (!client) return null;

    // Filtra apenas os ativos do cliente
    const ativosDoCliente = Array.isArray(ativos)
        ? ativos.filter(a => client.ativosFinanceiros.includes(a.id))
        : [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Detalhes do Cliente: {client.nome}</DialogTitle>
                    <DialogDescription>
                        Informações detalhadas e alocações de ativos do cliente.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Informações Pessoais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div><strong>Nome:</strong> {client.nome}</div>
                            <div><strong>Email:</strong> {client.email}</div>
                            <div>
                                <strong>Status:</strong>
                                <span
                                    className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        client.status === 'ativo'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {client.status === 'ativo' ? <Check size={12} className="mr-1" /> : <AlertCircle size={12} className="mr-1" />}
                                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Alocações de Ativos</h3>
                        {isLoading && <p>Carregando alocações...</p>}
                        {error && <p className="text-red-500">Erro ao buscar ativos: {error.message}</p>}
                        {ativosDoCliente.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ativo</TableHead>
                                        <TableHead className="text-right">Valor Atual</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ativosDoCliente.map((ativo) => (
                                        <TableRow key={ativo.id}>
                                            <TableCell>{ativo.nome}</TableCell>
                                            <TableCell className="text-right">
                                                R$ {ativo.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            !isLoading && !error && <p className="text-gray-500">Nenhuma alocação de ativo encontrada para este cliente.</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Fechar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};