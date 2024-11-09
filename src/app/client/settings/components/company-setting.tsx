'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

export default function CompanySetting() {
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    street: '',
    number: '',
    zipCode: '',
    state: '',
    city: '',
    phone: '',
    responsiblePerson: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]

  return (
    <div className="min-h-screen bg-[#0B1829] p-4 text-white">
      <Card className="mx-auto max-w-4xl bg-[#0B1829] border-none">
        <CardHeader>
          <CardTitle className="text-2xl">Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  placeholder="Digite aqui"
                  className="mt-1.5 bg-[#132236] border-[#132236]"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="__.___.___/____-__"
                  className="mt-1.5 bg-[#132236] border-[#132236]"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                />
              </div>

              <div>
                <Label>Endereço</Label>
                <div className="grid gap-4 mt-1.5 md:grid-cols-12">
                  <div className="md:col-span-5">
                    <Input
                      placeholder="Digite aqui"
                      className="bg-[#132236] border-[#132236]"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    />
                    <Label className="text-xs text-muted-foreground mt-1">Rua</Label>
                  </div>
                  <div className="md:col-span-3">
                    <Input
                      placeholder="Digite aqui"
                      className="bg-[#132236] border-[#132236]"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    />
                    <Label className="text-xs text-muted-foreground mt-1">Número</Label>
                  </div>
                  <div className="md:col-span-4">
                    <Input
                      placeholder="_____-___"
                      className="bg-[#132236] border-[#132236]"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                    <Label className="text-xs text-muted-foreground mt-1">CEP</Label>
                  </div>
                </div>
                <div className="grid gap-4 mt-4 md:grid-cols-12">
                  <div className="md:col-span-2">
                    <Select
                      value={formData.state}
                      onValueChange={(value) => setFormData({ ...formData, state: value })}
                    >
                      <SelectTrigger className="bg-[#132236] border-[#132236]">
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {brazilianStates.map((state) => (
                          <SelectItem key={state} value={state.toLowerCase()}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Label className="text-xs text-muted-foreground mt-1">UF</Label>
                  </div>
                  <div className="md:col-span-10">
                    <Input
                      placeholder="Digite aqui"
                      className="bg-[#132236] border-[#132236]"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    <Label className="text-xs text-muted-foreground mt-1">Cidade</Label>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="+55 ( ) _____-____"
                    className="mt-1.5 bg-[#132236] border-[#132236]"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="responsiblePerson">Vendedor</Label>
                  <Input
                    id="responsiblePerson"
                    placeholder="Digite aqui"
                    className="mt-1.5 bg-[#132236] border-[#132236]"
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                className="bg-[#0047AB] hover:bg-[#0047AB]/90 text-white border-none"
              >
                Inserir logo
              </Button>
              <Button
                type="submit"
                className="bg-[#2EAF7D] hover:bg-[#2EAF7D]/90 text-white"
              >
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}