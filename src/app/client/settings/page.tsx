'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useState } from "react"
// import { Upload } from 'lucide-react'
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

export default function CompanySettings() {
  const router = useRouter()
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
    console.log(formData)
  }

  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [open, setOpen] = useState(false);

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

  const handleUpload = () => {
    console.log("Uploading image:", image)
  }

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
            <div>
              <label htmlFor="companyName" className="mb-2 block text-sm text-white">
                Nome da Empresa
              </label>
              <input
                type="text"
                id="companyName"
                placeholder="Digite aqui"
                className="w-full rounded-md bg-[#132236] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="cnpj" className="mb-2 block text-sm text-white">
                CNPJ
              </label>
              <input
                type="text"
                id="cnpj"
                placeholder="__.___.___/____-__"
                className="w-full rounded-md bg-[#132236] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="mb-2 block text-sm text-white">
                Endereço
              </label>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[240px]">
                  <div className="text-xs text-white mb-1">Rua</div>
                  <input
                    type="text"
                    placeholder="Digite aqui"
                    className="w-full rounded-md bg-[#132236] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>
                <div className="w-32">
                  <div className="text-xs text-white mb-1">Número</div>
                  <input
                    type="text"
                    placeholder="_ _ _ _"
                    className="w-full rounded-md bg-[#132236] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  />
                </div>
                <div className="w-40">
                  <div className="text-xs text-white mb-1">CEP</div>
                  <input
                    type="text"
                    placeholder="_____-___"
                    className="w-full rounded-md bg-[#132236] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="w-32">
                  <div className="text-xs text-white mb-1">UF</div>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-md bg-[#132236] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                  >
                    <option value="">Selecione</option>
                    {brazilianStates.map((state) => (
                      <option key={state} value={state.toLowerCase()}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[240px]">
                  <div className="text-xs text-white mb-1">Cidade</div>
                  <input
                    type="text"
                    placeholder="Digite aqui"
                    className="w-full rounded-md bg-[#132236] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm text-white">
                  Telefone
                </label>
                <input
                  type="text"
                  id="phone"
                  placeholder="+55 (   ) _____-____"
                  className="w-full rounded-md bg-[#132236] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="responsiblePerson" className="mb-2 block text-sm text-white">
                  Vendedor
                </label>
                <input
                  type="text"
                  id="responsiblePerson"
                  placeholder="Digite aqui"
                  className="w-full rounded-md bg-[#132236] px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0051FF] border-[#132236]"
                  value={formData.responsiblePerson}
                  onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <button
                  type="button"
                  className="rounded-md bg-[#0047AB] px-4 py-2 text-sm font-medium text-white hover:bg-[#0047AB]/90 border-none"
                  onClick={() => setOpen(true)}
                >
                  Inserir logo
                </button>
              </DialogTrigger>


              <button
                type="submit"
                className="rounded-md bg-green-500 px-8 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                Salvar
              </button>


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
          </div>

        </form>
      </div>
    </div>
  )
}

