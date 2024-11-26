'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getSettings, upsertSettings } from '@/services/api/settings/actions'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CompanySettings() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    street: '',
    number: 0,
    zipCode: '',
    state: '',
    city: '',
    phone: '',
    responsiblePerson: '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings()
        if (settings) {
          setFormData(settings)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await upsertSettings(formData)
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]

  const handleCancel = () => {
    setImage(null)
    setPreview("")
    setOpen(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    console.log(image)
    // Implement image upload logic here
  }

  const formatCNPJ = (value: string) => {
    return value.replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18)
  }

  const formatPhone = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    if (numericValue.startsWith('55')) {
      return numericValue
        .replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4')
        .slice(0, 19)
    } else {
      return numericValue
        .replace(/^(\d{2})(\d)/, '+55 ($1) $2')
        .replace(/(\d{5})(\d{1,4})/, '$1-$2')
        .slice(0, 19)
    }
  }

  const formatCEP = (value: string): string => {
    return value
      .replace(/\D/g, '') // Remove todos os caracteres não numéricos
      .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o traço após os cinco primeiros dígitos
      .slice(0, 9); // Garante que o valor final tenha no máximo 9 caracteres
  };


  const renderInput = (id: string, label: string, placeholder: string, value: string | number, onChange: (value: string) => void, type: string = "text") => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white">
        {label}
      </Label>
      <Input
        type={type}
        id={id}
        placeholder={placeholder}
        className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a192f] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6 text-white hover:text-gray-300 hover:bg-[#132236] p-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="bg-[#132236] border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                {renderInput("companyName", "Nome da Empresa", "Digite aqui", formData.companyName, (value) => setFormData({ ...formData, companyName: value }))}
                {renderInput("cnpj", "CNPJ", "__.___.___/____-__", formData.cnpj, (value) => setFormData({ ...formData, cnpj: formatCNPJ(value) }))}

                <div className="space-y-4">
                  <Label className="text-white">Endereço</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                      {renderInput("street", "Rua", "Digite aqui", formData.street, (value) => setFormData({ ...formData, street: value }))}
                    </div>
                    <div>
                      {renderInput("number", "Número", "_ _ _ _", formData.number, (value) => setFormData({ ...formData, number: Number(value) }), "number")}
                    </div>
                    <div>
                      {renderInput("zipCode", "CEP", "_____-___", formData.zipCode, (value) => setFormData({ ...formData, zipCode: formatCEP(value) }))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state" className="text-white">UF</Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) => setFormData({ ...formData, state: value })}
                      >
                        <SelectTrigger className="w-full bg-[#132236] text-white border-[#0051FF] focus:ring-[#0051FF]">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#132236] text-white">
                          {brazilianStates.map((state) => (
                            <SelectItem key={state} value={state.toLowerCase()}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      {renderInput("city", "Cidade", "Digite aqui", formData.city, (value) => setFormData({ ...formData, city: value }))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInput("phone", "Telefone", "+55 (   ) _____-____", formData.phone, (value) => setFormData({ ...formData, phone: formatPhone(value) }))}
                  {renderInput("responsiblePerson", "Vendedor", "Digite aqui", formData.responsiblePerson, (value) => setFormData({ ...formData, responsiblePerson: value }))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      className="bg-[#0047AB] text-white hover:bg-[#0047AB]/90"
                    >
                      Inserir logo
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md bg-[#0a192f] border-gray-800">
                    <DialogHeader>
                      <DialogTitle className="text-white">Upload de Logo</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Selecione uma imagem para usar como logo da empresa
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="grid w-full items-center gap-1.5">
                          <Label htmlFor="image" className="text-white">
                            Imagem
                          </Label>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="text-gray-400 bg-transparent border-gray-700"
                            onChange={handleImageChange}
                          />
                        </div>
                        {preview && (
                          <div className="relative w-40 h-40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preview}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-between">
                      <Button
                        type="button"
                        variant="secondary"
                        className="text-white bg-transparent border border-gray-700 hover:bg-gray-800"
                        onClick={handleCancel}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        onClick={handleUpload}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        disabled={!image}
                      >
                        Salvar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  type="submit"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}