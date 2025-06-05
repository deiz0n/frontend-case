import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClienteFormData } from '@/lib/types';
import { clienteFormSchema } from '@/lib/schemas';
import { useEffect, useState } from 'react';
import { buscarAtivosFinanceiros } from '@/lib/api';
import { AtivoFinanceiro } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ClientFormProps {
    onSubmit: (data: ClienteFormData) => void;
    onCancel: () => void;
    defaultValues?: Partial<ClienteFormData>;
    isSubmitting?: boolean;
}

export const ClienteForm: React.FC<ClientFormProps> = ({ onSubmit, onCancel, defaultValues, isSubmitting }) => {
    const [ativos, setAtivos] = useState<AtivoFinanceiro[]>([]);

    useEffect(() => {
        buscarAtivosFinanceiros().then(res => setAtivos(Array.isArray(res) ? res : []));
    }, []);

    const form = useForm<ClienteFormData>({
        resolver: zodResolver(clienteFormSchema),
        defaultValues: {
            nome: '',
            email: '',
            ativosFinanceiros: [],
            ...defaultValues,
            status: defaultValues?.status?.toUpperCase() === 'INATIVO' ? 'INATIVO' : 'ATIVO',
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        const dadosParaEnviar = {
            nome: data.nome,
            email: data.email,
            status: data.status,
            ativos: data.ativosFinanceiros
        };

        onSubmit(dadosParaEnviar);
    });

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField<ClienteFormData>
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome *</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome completo do cliente" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField<ClienteFormData>
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField<ClienteFormData>
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={typeof field.value === "string" ? field.value : field.value?.[0] ?? "ATIVO"}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="ATIVO">Ativo</SelectItem>
                                    <SelectItem value="INATIVO">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField<ClienteFormData>
                    control={form.control}
                    name="ativosFinanceiros"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel>Ativos Financeiros</FormLabel>
                            <FormControl>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {Array.isArray(ativos) && ativos.map(ativo => (
                                        <div
                                            key={ativo.id}
                                            className={`border rounded-md p-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                                                field.value.includes(ativo.id) ? 'border-primary bg-primary/5' : 'border-gray-200'
                                            }`}
                                            onClick={() => {
                                                const currentValues = [...field.value];
                                                const index = currentValues.indexOf(ativo.id);

                                                if (index === -1) {
                                                    currentValues.push(ativo.id);
                                                } else {
                                                    currentValues.splice(index, 1);
                                                }

                                                field.onChange(currentValues);
                                            }}
                                        >
                                            <div className="flex items-start space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={field.value.includes(ativo.id)}
                                                    onChange={() => {}} // Controlado pelo onClick do card
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <div className="font-medium">{ativo.nome}</div>
                                                    <div className="text-sm text-gray-500">
                                                        R$ {ativo.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </FormControl>
                            <FormDescription>
                                Selecione um ou mais ativos financeiros. Clique nos cartões para selecionar.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? (defaultValues?.nome ? 'Atualizando...' : 'Adicionando...') : (defaultValues?.nome ? 'Atualizar Cliente' : 'Adicionar Cliente')}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};