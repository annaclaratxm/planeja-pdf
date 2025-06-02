"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { deleteCustomer } from "@/services/api/customer/actions";
import { Customer } from "@/services/api/customer/types";
import { MoreHorizontal, Search } from 'lucide-react';
import React from "react";
import { CustomerModal } from "./customer-modal";

function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10 && digits.length <= 11) {
    const ddd = digits.slice(0, 2);
    const part1 = digits.slice(2, -4);
    const part2 = digits.slice(-4);
    return `+55 (${ddd}) ${part1}-${part2}`;
  }
  return phone;
}

interface CustomerDataTableProps {
  data: Customer[];
}

export function CustomerDataTable({ data }: CustomerDataTableProps) {
  const [customers] = React.useState<Customer[]>(data);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | undefined>(undefined);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [customerToDelete, setCustomerToDelete] = React.useState<Customer | null>(null);

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!customerToDelete) return;

    await deleteCustomer({ id: customerToDelete.id });
    setIsConfirmModalOpen(false);
    toast({
      title: "Cliente Deletado",
      description: "O cliente foi removido com sucesso.",
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0a192f] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <Button
            onClick={() => {
              setSelectedCustomer(undefined);
              setIsModalOpen(true);
            }}
            className="bg-[#0051FF] text-white hover:bg-[#0051FF]/90"
          >
            Adicionar novo cliente
          </Button>
        </div>
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Pesquisar cliente"
            className="w-full bg-[#132236] pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#0051FF] border-none"
          />
        </div>
        <div className="rounded-md bg-[#0a192f] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Nome</TableHead>
                <TableHead className="text-white">Telefone</TableHead>
                <TableHead className="text-white">E-mail</TableHead>
                <TableHead className="text-white">CNPJ/CPF</TableHead>
                <TableHead className="text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="text-white">{customer.name}</TableCell>
                  <TableCell className="text-white">{formatPhoneNumber(customer.phone)}</TableCell>
                  <TableCell className="text-white">{customer.email ?? "N/A"}</TableCell>
                  <TableCell className="text-white">{customer.cnpj || customer.cpf || "Não informado"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleConfirmDelete(customer)}
                          className="text-red-600"
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {isModalOpen && (
        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(undefined);
          }}
          customer={selectedCustomer}
        />
      )}

      {isConfirmModalOpen && customerToDelete && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#132236] p-6 rounded-md w-full max-w-md text-white border border-[#003380] shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirmar exclusão</h2>
            <p className="mb-6">
              Tem certeza que deseja excluir o cliente <strong>{customerToDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-[#1f2f46] text-white hover:bg-[#2b3d57]"
              >
                Cancelar
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteConfirmed}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
