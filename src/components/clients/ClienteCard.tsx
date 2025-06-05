"use client";

import React from 'react';
import { Cliente } from '@/lib/types';
import { Button } from '@/components/ui/button'; // [cite: 13, 15]
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Eye, Check, AlertCircle } from 'lucide-react';

interface ClienteCardProps {
    client: Cliente;
    onEdit: (client: Cliente) => void;
    onView: (client: Cliente) => void;
}

export const ClienteCard: React.FC<ClienteCardProps> = ({ client, onEdit, onView }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="mb-1">{client.nome}</CardTitle>
                        <CardDescription>{client.email}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); onEdit(client); }}
                            aria-label={`Editar ${client.nome}`}
                        >
                            <Edit size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); onView(client); }}
                            aria-label={`Visualizar ${client.nome}`}
                        >
                            <Eye size={16} />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2">
          <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.status === 'ATIVO'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}
          >
            {client.status === 'ATIVO' ? <Check size={12} className="mr-1" /> : <AlertCircle size={12} className="mr-1" />}
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </span>
                </div>
            </CardContent>
        </Card>
    );
};