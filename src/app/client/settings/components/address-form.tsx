import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddressFormProps {
    formData: {
        street: string
        number: number
        zipCode: string
        state: string
        city: string,
        neighborhood: string
    }
    setFormData: React.Dispatch<React.SetStateAction<unknown>>
}

export default function AddressForm({ formData, setFormData }: AddressFormProps) {
    const brazilianStates = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
        "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ]

    const formatCEP = (value: string): string => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 9);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label className="text-white">Endereço</Label>
                    <Input
                        id="street"
                        placeholder="Rua"
                        className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="number" className="text-white">Número</Label>
                    <Input
                        id="number"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Número"
                        className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: Number(e.target.value) })}
                    />
                </div>
                <div>
                    <Label htmlFor="zipcode" className="text-white">CEP</Label>
                    <Input
                        id="zipCode"
                        placeholder="CEP"
                        className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: formatCEP(e.target.value) })}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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
                    <Label htmlFor="city" className="text-white">Cidade</Label>
                    <Input
                        id="city"
                        placeholder="Cidade"
                        className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <Label htmlFor="neighborhood" className="text-white">Bairro</Label>
                <Input
                    id="neighborhood"
                    placeholder="Bairro"
                    className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                />
            </div>
        </div>
    )
}
