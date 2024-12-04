import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cancelSubscription, getPayments, getPlans, getSubscription } from '@/services/api/payment/subscription'
import { CreditCard, Crown, History } from 'lucide-react'
import { SubscriptionPlans } from './components/subscription-plans'

export default async function PaymentsPage() {
    const plans = await getPlans();
    const subscription = await getSubscription();
    const payments = subscription ? await getPayments(subscription.id) : []

    return (
        <div className="min-h-screen">
            <div className="container mx-auto py-10 space-y-10">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Assinaturas</h1>
                    <p className="text-muted-foreground">
                        Gerencie suas assinaturas e visualize seu histórico de pagamentos
                    </p>
                </div>

                {subscription ? (
                    <Card className="border-primary">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Crown className="h-6 w-6 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">Assinatura Ativa</CardTitle>
                                    <CardDescription>Detalhes da sua assinatura atual</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                                        <span className="font-medium">Plano</span>
                                        <span className="text-primary font-semibold">{subscription.plan.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                                        <span className="font-medium">Status</span>
                                        <span className="capitalize text-success font-semibold">{subscription.status}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                                        <span className="font-medium">Data de Início</span>
                                        <span>{subscription.startDate.toLocaleDateString()}</span>
                                    </div>
                                    {subscription.endDate && (
                                        <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                                            <span className="font-medium">Data de Término</span>
                                            <span>{subscription.endDate.toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <form action={async () => {
                                await cancelSubscription(subscription.id)
                            }}>
                                <Button type="submit" variant="destructive">
                                    Cancelar assinatura
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="border-primary/10">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-6 w-6 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">Escolha um Plano</CardTitle>
                                    <CardDescription>Selecione o melhor plano para você</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <SubscriptionPlans plans={plans} />
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <History className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle className="text-2xl">Histórico de Pagamentos</CardTitle>
                                <CardDescription>Seus pagamentos recentes</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {payments.length > 0 ? (
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Data</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payments.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>{payment.paymentDate.toLocaleDateString()}</TableCell>
                                                <TableCell className="font-medium">R${payment.amount.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                                                        {payment.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-muted-foreground">
                                Nenhum pagamento registrado.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}