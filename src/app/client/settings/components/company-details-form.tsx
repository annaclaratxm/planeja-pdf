import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CompanyDetailsFormProps {
  formData: {
    companyName: string
    cnpj: string
  }
  setFormData: React.Dispatch<React.SetStateAction<unknown>>
}

export default function CompanyDetailsForm({ formData, setFormData }: CompanyDetailsFormProps) {
  const formatCNPJ = (value: string) => {
    return value.replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-white">Nome da Empresa</Label>
        <Input
          id="companyName"
          placeholder="Digite aqui"
          className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cnpj" className="text-white">CNPJ</Label>
        <Input
          id="cnpj"
          placeholder="__.___.___/____-__"
          className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
          value={formData.cnpj}
          onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
        />
      </div>
    </div>
  )
}

