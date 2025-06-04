"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClienteFormData } from '@/lib/types';
import { clienteFormSchema } from '@/lib/schemas'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ClientFormProps {
    onSubmit: (data: ClienteFormData) => void;
    onCancel: () => void;
    defaultValues?: Partial<ClienteFormData>;
    isSubmitting?: boolean;
}

export const ClienteForm: React.FC<ClientFormProps> = ({ onSubmit, onCancel, defaultValues, isSubmitting }) => {
    const form = useForm<ClienteFormData>({
        resolver: zodResolver(clienteFormSchema),
        defaultValues: defaultValues || {
            nome: '',
            email: '',
            status: 'ativo',
        },
    });

    const handleSubmit = form.handleSubmit(async (data) => {
        onSubmit(data);
    });

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
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

                <FormField
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

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
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
        </Form>
    );
};