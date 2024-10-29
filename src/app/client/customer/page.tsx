"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

import { deleteCustomer } from "@/pages/api/customer/actions"
import { Customer } from "@/pages/api/customer/types"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

interface CustomerDataTableProps {
  data: Customer[]
}

export function CustomerDataTable({ data }: CustomerDataTableProps) {
  const router = useRouter()

  const [customers] = React.useState<Customer[]>(data)
  const [newCustomer, setNewCustomer] = React.useState<Customer>({
    id: "",
    name: "",
    phone: "",
    email: "", birthdate: new Date(),
    userId: ""
  })

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }) => <span>{row.getValue("phone")}</span>,
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: ({ row }) => <span>{row.getValue("email") ?? "N/A"}</span>,
    },
    {
      accessorKey: "birthdate",
      header: "Data",
      cell: ({ row }) => (
        <span>{row.getValue("birthdate") ? new Date(row.getValue("birthdate")).toLocaleDateString() : "N/A"}</span>
      ),
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
            <DropdownMenuItem onClick={() => handleDeleteCustomer(row.original.id)}>
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // const handleAddCustomer = async (customer: Customer) => {
  //   await upsertCustomer({
  //     birthdate: customer.birthdate,
  //     email: customer.email,
  //     name: customer.name,
  //     phone: customer.phone,
  //     userId: customer.userId
  //   })
  //   setNewCustomer({ id: "", name: "", phone: "", email: "", birthdate: new Date(), userId: "" })
  //   fetchCustomers()
  // }

  const handleDeleteCustomer = async (id: string) => {
    await deleteCustomer({ id: id })
    router.refresh()

    toast({
      title: "Cliente Deletado",
      description: "O cliente foi removido com sucesso.",
    })
  }

  // async function fetchCustomers() {
  //   const updatedCustomers = await getUserCustomers()
  //   setCustomers(updatedCustomers)
  // }

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Clientes</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar novo cliente
        </Button>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Pesquisar"
          className="pl-10 bg-[#092C44] border-blue-900 text-white placeholder:text-gray-400"
          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
        />
      </div>
      <div className="rounded-lg border border-blue-900 bg-[#092C44]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : typeof header.column.columnDef.header === 'function'
                        ? header.column.columnDef.header(header.getContext()) // caso seja uma função
                        : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{cell.renderValue() as React.ReactNode}</TableCell>
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
  )
}
