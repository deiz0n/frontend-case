"use client";

import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { buscarAtivosFinanceiros } from '@/lib/api';
import { AtivoFinanceiro } from '@/lib/types';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AssetsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: assets, isLoading, error } = useQuery<AtivoFinanceiro[], Error>(
        ['assets'],
        buscarAtivosFinanceiros
    );

    const filteredAssets = assets?.filter(asset =>
        asset.nome.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) return <div className="text-center py-10">Carregando ativos...</div>;
    if (error) return (
        <div className="text-center py-10 text-red-600">
            <AlertTriangle size={48} className="mx-auto mb-2" />
            Erro ao carregar ativos: {error.message}
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
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Ativos Financeiros</h1>
                <p className="text-gray-600">Visualize todos os ativos financeiros disponíveis.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="Buscar ativos por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredAssets.map((asset) => (
                        <Card key={asset.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="bg-gradient-to-r from-emerald-100 to-teal-50 px-4 py-3 border-b">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-emerald-600">Nome do ativo</p>
                                    <CardTitle className="text-base font-bold text-green-700 truncate">
                                        {asset.nome}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-emerald-600">Valor atual</p>
                                    <span className="text-lg font-semibold text-gray-900 block">
                            R$ {asset.valorAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        {searchTerm ? 'Nenhum ativo encontrado.' : 'Nenhum ativo cadastrado.'}
                    </p>
                </div>
            )}
        </div>
    );
}