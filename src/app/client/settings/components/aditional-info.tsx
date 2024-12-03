import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AdditionalInfoFormProps {
    formData: {
        budgetValidityDays: number
        deliveryTimeDays: number
        paymentMethod: string
        observation: string
    }
    setFormData: React.Dispatch<React.SetStateAction<unknown>>
}

export default function AdditionalInfoForm({ formData, setFormData }: AdditionalInfoFormProps) {
    return (
        <div className="space-y-4">
            <div className="flex space-x-4">
                <div className="space-y-2 flex-1">
                    <Label htmlFor="budgetValidityDays" className="text-white">Validade do Orçamento (dias)</Label>
                    <Input
                        id="budgetValidityDays"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Digite aqui"
                        className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                        value={formData.budgetValidityDays}
                        onChange={(e) => setFormData({ ...formData, budgetValidityDays: Number(e.target.value) })}
                    />
                </div>
                <div className="space-y-2 flex-1">
                    <Label htmlFor="deliveryTimeDays" className="text-white">Prazo de Entrega (dias)</Label>
                    <Input
                        id="deliveryTimeDays"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Digite aqui"
                        className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                        value={formData.deliveryTimeDays}
                        onChange={(e) => setFormData({ ...formData, deliveryTimeDays: Number(e.target.value) })}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-white">Forma de Pagamento</Label>
                <Textarea
                    id="paymentMethod"
                    placeholder="Digite aqui por extenso as formas de pagamento aceitas."
                    className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    rows={4}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="observation" className="text-white">Observações</Label>
                <Textarea
                    id="observation"
                    placeholder="Digite aqui por extenso as observações do seu orçamento."
                    className="bg-[#132236] text-white placeholder-gray-400 border-[#0051FF] focus:ring-[#0051FF]"
                    value={formData.observation}
                    onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                    rows={4}
                />
            </div>
        </div>
    )
}