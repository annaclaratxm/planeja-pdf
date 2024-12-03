'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSettings, upsertSettings } from '@/services/api/settings/actions'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AddressForm from './components/address-form'
import AdditionalInfoForm from "./components/aditional-info"
import CompanyDetailsForm from './components/company-details-form'
import ContactForm from './components/contact-form'
import LogoUpload from './components/logo-upload'

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
    logo: '',
    budgetValidityDays: 0,
    deliveryTimeDays: 0,
    observation: '',
    paymentMethod: '',
    neighborhood: ''
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings) {
          setFormData({
            ...settings,
            logo: settings.logo || '',
            budgetValidityDays: settings.budgetValidityDays || 0,
            deliveryTimeDays: settings.deliveryTimeDays || 0,
            paymentMethod: settings.paymentMethod || '',
            observation: settings.observation || '',
            neighborhood: settings.neighborhood || ''
          });
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
              <CompanyDetailsForm formData={formData} setFormData={setFormData} />
              <AddressForm formData={formData} setFormData={setFormData} />
              <ContactForm formData={formData} setFormData={setFormData} />
              <AdditionalInfoForm formData={formData} setFormData={setFormData} />
              <LogoUpload formData={formData} setFormData={setFormData} />
              <Button
                type="submit"
                onClick={handleSubmit}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Salvar informações
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

