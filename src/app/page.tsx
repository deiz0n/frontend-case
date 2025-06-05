"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart3 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Anka Tech Investimentos</h1>
          <p className="text-xl text-gray-600">Escolha uma área para acessar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users size={48} className="text-blue-500 mb-2" />
              <CardTitle className="text-2xl">Clientes</CardTitle>
              <CardDescription>Gerencie os dados dos clientes e seus investimentos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Visualize, adicione e edite informações dos clientes e seus ativos financeiros.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                  className="w-full cursor-pointer"
                  size="lg"
                  onClick={() => router.push('/clients')}
              >
                Acessar Clientes
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 size={48} className="text-green-500 mb-2" />
              <CardTitle className="text-2xl">Ativos Financeiros</CardTitle>
              <CardDescription>Visualize todos os ativos disponíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Consulte a lista completa de ativos financeiros e seus valores atuais.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                  className="w-full cursor-pointer"
                  size="lg"
                  onClick={() => router.push('/assets')}
              >
                Visualizar Ativos
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
  );
}