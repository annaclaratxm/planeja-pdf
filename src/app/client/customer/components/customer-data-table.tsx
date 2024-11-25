"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Plus, Search } from 'lucide-react';
import React from "react";
import { CustomerModal } from "./customer-modal";

function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const digits = phone.replace(/\D/g, '');

  // Verifica se é um número de telefone brasileiro válido (com ou sem DDD)
  if (digits.length >= 10 && digits.length <= 11) {
    const ddd = digits.slice(0, 2);
    const part1 = digits.slice(2, -4);
    const part2 = digits.slice(-4);
    return `+55 (${ddd}) ${part1}-${part2}`;
  }

  // Se não for um número válido, retorna o formato original
  return phone;
}

// import { formatPhoneNumber } from "@/utils/formatPhoneNumber"; //This import is now redundant, but kept for clarity in case the function is moved later.


interface CustomerDataTableProps {
  data: Customer[];
}

export function CustomerDataTable({ data }: CustomerDataTableProps) {
  const [customers] = React.useState<Customer[]>(data);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | undefined>(undefined);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }) => <span>{formatPhoneNumber(row.getValue("phone"))}</span>,
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: ({ row }) => <span>{row.getValue("email") ?? "N/A"}</span>,
    },
    {
      accessorKey: "birthdate",
      header: "Data de nascimento",
      cell: ({ row }) => {
        const birthdate = row.getValue("birthdate");
        return <span>{birthdate ? new Date(birthdate as Date).toLocaleDateString() : "N/A"}</span>;
      },
    },
    {
      accessorKey: "cnpjCpf",
      header: "CNPJ/CPF",
      cell: ({ row }) => {
        const customer = row.original;
        if (customer.cnpj) {
          return <span>{customer.cnpj}</span>;
        } else if (customer.cpf) {
          return <span>{customer.cpf}</span>;
        } else {
          return <span>Não informado</span>;
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleEditCustomer(row.original)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteCustomer(row.original.id)}>
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Clientes</h2>
        <Button
          variant="destructive"
          onClick={() => {
            setSelectedCustomer(undefined);
            setIsModalOpen(true);
          }}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar novo cliente
        </Button>
        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(undefined);
          }}
          customer={selectedCustomer}
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Pesquisar"
          className="pl-10 bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500"
        />
      </div>
      <div className="rounded-lg border border-gray-700 bg-gray-800">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {
              table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {typeof cell.column.columnDef.cell === 'function' ? cell.column.columnDef.cell(cell.getContext()) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

