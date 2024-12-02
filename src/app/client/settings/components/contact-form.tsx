import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ContactFormProps {
    formData: {
        phone: string
        responsiblePerson: string
    }
    setFormData: React.Dispatch<React.SetStateAction<unknown>>
}

export default function ContactForm({ formData, setFormData }: ContactFormProps) {
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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Telefone</Label>
                <Input
                    id="phone"
                    placeholder="+55 (   ) _____-____"
                    className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="responsiblePerson" className="text-white">Vendedor</Label>
                <Input
                    id="responsiblePerson"
                    placeholder="Digite aqui"
                    className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                    value={formData.responsiblePerson}
                    onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                />
            </div>
        </div>
    )
}

