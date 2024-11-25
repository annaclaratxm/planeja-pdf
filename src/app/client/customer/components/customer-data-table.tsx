"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { deleteCustomer } from "@/services/api/customer/actions";
import { Customer } from "@/services/api/customer/types";
import { Search } from "lucide-react";
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

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (id: string) => {
    await deleteCustomer({ id });
    window.location.reload();
    toast({
      title: "Cliente Deletado",
      description: "O cliente foi removido com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a192f] p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <Button
            onClick={() => {
              setSelectedCustomer(undefined);
              setIsModalOpen(true);
            }}
            className="rounded-md bg-[#0051FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#0051FF]/90"
          >
            Adicionar novo cliente
          </Button>
        </div>
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Pesquisar cliente"
            className="w-full rounded-md bg-[#132236] py-3 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF]"
          />
        </div>
        <div className="rounded-md bg-[#0a192f]">
          <div className="grid grid-cols-5 gap-4 border-b border-gray-700 p-4 text-sm text-white last:border-0">
            <div>Nome</div>
            <div>Telefone</div>
            <div>E-mail</div>
            <div>CNPJ/CPF</div>
            <div>Ações</div>
          </div>
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="grid grid-cols-5 gap-4 border-b border-gray-700 p-4 text-sm text-white last:border-0"
            >
              <div>{customer.name}</div>
              <div>{formatPhoneNumber(customer.phone)}</div>
              <div>{customer.email ?? "N/A"}</div>
              <div>{customer.cnpj || customer.cpf || "Não informado"}</div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => handleEditCustomer(customer)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Editar cliente"
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="text-red-500 hover:text-red-400"
                  aria-label="Excluir cliente"
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
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
    </div>
  );
}
