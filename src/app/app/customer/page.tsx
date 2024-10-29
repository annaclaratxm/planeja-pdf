"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus } from "lucide-react"
import { useEffect, useState } from "react"

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  birthdate?: string
}

export default function Component() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    birthdate: "",
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    const res = await fetch("/api/customers")
    const data: Customer[] = await res.json()
    setCustomers(data)
  }

  async function addCustomer() {
    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    })
    setNewCustomer({ name: "", phone: "", email: "", birthdate: "" })
    fetchCustomers()
  }

  async function deleteCustomer(id: string) {
    await fetch(`/api/customers/${id}`, { method: "DELETE" })
    fetchCustomers()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#051B2C]">
      <main className="flex-1 p-8">
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
          />
        </div>
        <div className="rounded-lg border border-blue-900 bg-[#092C44]">
          <Table>
            <TableHeader>
              <TableRow className="border-blue-900 hover:bg-transparent">
                <TableHead className="text-white">Nome</TableHead>
                <TableHead className="text-white">Telefone</TableHead>
                <TableHead className="text-white">E-mail</TableHead>
                <TableHead className="text-white">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="border-blue-900 hover:bg-[#0A3352]">
                  <TableCell className="text-white">{customer.name}</TableCell>
                  <TableCell className="text-white">{customer.phone}</TableCell>
                  <TableCell className="text-white">{customer.email ?? "N/A"}</TableCell>
                  <TableCell className="text-white">
                    {customer.birthdate
                      ? new Date(customer.birthdate).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}