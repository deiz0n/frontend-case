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
        onSubmit(data);
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
                        <FormItem>
                            <FormLabel>Ativos Financeiros</FormLabel>
                            <FormControl>
                                <select
                                    multiple
                                    value={field.value}
                                    onChange={e => {
                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                        field.onChange(selected);
                                    }}
                                    className="w-full border rounded px-2 py-1"
                                >
                                    {Array.isArray(ativos) && ativos.map(ativo => (
                                        <option key={ativo.id} value={ativo.id}>
                                            {ativo.nome} (R$ {ativo.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormDescription>Selecione um ou mais ativos financeiros.</FormDescription>
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