'use client'

import { Button } from "@/components/ui/button"
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
      console.log('Settings saved successfully')
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

  const renderInput = (id: string, label: string, placeholder: string, value: string | number, onChange: (value: string) => void, type: string = "text") => (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-white">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className="w-full h-[46px] rounded-md bg-[#132236] px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a192f] p-8">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-white hover:text-gray-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </button>

        <h1 className="mb-8 text-2xl font-bold text-white">Configurações</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {renderInput("companyName", "Nome da Empresa", "Digite aqui", formData.companyName, (value) => setFormData({ ...formData, companyName: value }))}
            {renderInput("cnpj", "CNPJ", "__.___.___/____-__", formData.cnpj, (value) => setFormData({ ...formData, cnpj: formatCNPJ(value) }))}

            <div className="space-y-4">
              <label className="mb-2 block text-sm text-white">
                Endereço
              </label>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[240px]">
                  {renderInput("street", "Rua", "Digite aqui", formData.street, (value) => setFormData({ ...formData, street: value }))}
                </div>
                <div className="w-32">
                  {renderInput("number", "Número", "_ _ _ _", formData.number, (value) => setFormData({ ...formData, number: Number(value) }), "number")}
                </div>
                <div className="w-40">
                  {renderInput("zipCode", "CEP", "_____-___", formData.zipCode, (value) => setFormData({ ...formData, zipCode: value }))}
                </div>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <div>
                  <label htmlFor="state" className="block text-xs text-white mb-1">UF</label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full h-[46px] rounded-md bg-[#132236] px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                  >
                    <option value="">Selecione</option>
                    {brazilianStates.map((state) => (
                      <option key={state} value={state.toLowerCase()}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="city" className="block text-xs text-white mb-1">Cidade</label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Digite aqui"
                    className="w-full h-[46px] rounded-md bg-[#132236] px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {renderInput("phone", "Telefone", "+55 (   ) _____-____", formData.phone, (value) => setFormData({ ...formData, phone: formatPhone(value) }))}
              {renderInput("responsiblePerson", "Vendedor", "Digite aqui", formData.responsiblePerson, (value) => setFormData({ ...formData, responsiblePerson: value }))}
            </div>
          </div>

          <div className="flex justify-between">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="rounded-md bg-[#0047AB] px-4 py-2 text-sm font-medium text-white hover:bg-[#0047AB]/90 border-none"
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
                      <div className="flex items-center gap-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          className="text-gray-400 bg-transparent border-gray-700"
                          onChange={handleImageChange}
                        />
                      </div>
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
              className="rounded-md bg-green-500 px-8 py-2 text-sm font-medium text-white hover:bg-green-600"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}