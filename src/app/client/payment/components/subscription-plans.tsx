'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { PaymentModal } from './payment-modal'

interface Plan {
    id: string
    name: string
    description: string | null
    price: number
    interval: 'Mensal' | 'Anual'
    features?: string[]
}

interface SubscriptionPlansProps {
    plans: Plan[]
}

export function SubscriptionPlans({ plans }: SubscriptionPlansProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
                <Card
                    key={plan.id}
                    className={`relative flex flex-col overflow-hidden transition-transform hover:scale-105
            ${index === 1 ? 'border-primary shadow-lg scale-105 md:scale-110' : 'border-border'}
          `}
                >
                    {index === 1 && (
                        <div className="absolute top-0 right-0 bg-primary px-3 py-1 rounded-bl-lg text-sm font-medium text-primary-foreground">
                            Popular
                        </div>
                    )}
                    <CardHeader className="text-center pb-8">
                        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                        <CardDescription className="text-sm">
                            {plan.description?.split('\n').map((line, index) => (
                                <span key={index} className="block mt-1">{line}</span>
                            ))}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-6">
                        <div className="text-center">
                            <span className="text-4xl font-bold text-primary">
                                R${plan.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                                /{plan.interval.toLowerCase()}
                            </span>
                        </div>
                        <ul className="space-y-2">
                            {(plan.features || [
                                'Acesso a todas as funcionalidades',
                                'Suporte por email',
                                'Atualizações gratuitas',
                            ]).map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <PaymentModal plan={plan} />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}