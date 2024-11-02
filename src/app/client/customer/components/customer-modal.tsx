'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { upsertCustomer } from '@/services/api/customer/actions'
import { Customer } from '@/services/api/customer/types'

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'O nome precisa ter ao menos dois dígitos.',
    }),
    phone: z.string().min(10, {
        message: 'O telefone precisa ter ao menos dois dígitos.',
    }),
    email: z.string().email({
        message: 'Por favor, insira um endereço de e-mail válido.',
    }),
    birthdate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Por favor, insira uma data válida.',
    }),
})

interface CustomerModalProps {
    isOpen: boolean
    onClose: () => void
    customer?: Customer
}

export function CustomerModal({
    isOpen,
    onClose,
    customer,
}: CustomerModalProps) {
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            birthdate: '',
        },
    })

    useEffect(() => {
        if (customer) {
            form.reset({
                name: customer.name,
                phone: customer.phone,
                email: customer.email || '',
                birthdate: customer.birthdate
                    ? new Date(customer.birthdate).toISOString().split('T')[0]
                    : '',
            })
        }
    }, [customer, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // const isUnique = await checkIfUnique(data);
            // if (!isUnique) {
            //     toast({
            //         title: "Erro",
            //         description: "Os dados fornecidos já existem.",
            //     });
            //     return;
            // }

            if (customer) {
                await upsertCustomer({
                    ...values,
                    id: customer.id,
                    birthdate: new Date(values.birthdate),
                })
                toast({
                    title: 'Cliente Atualizado',
                    description: 'O cliente foi atualizado com sucesso.',
                })
            } else {
                await upsertCustomer({
                    ...values,
                    birthdate: new Date(values.birthdate),
                })

                toast({
                    title: 'Cliente cadastrado',
                    description: 'O cliente foi criado com sucesso.',
                })
            }
            onClose()
            window.location.reload();
        } catch {
            toast({
                title: 'Erro',
                description: 'Ocorreu um erro ao salvar o cliente.',
                variant: 'destructive',
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {customer ? 'Editar Cliente' : 'Adicionar Cliente'}
                    </DialogTitle>
                    <DialogDescription>
                        {customer
                            ? 'Edite os detalhes do cliente aqui.'
                            : 'Adicione um novo cliente aqui.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do cliente" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Telefone do cliente" maxLength={11} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E-mail do cliente" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birthdate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data de Nascimento</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit">{customer ? 'Salvar' : 'Adicionar'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
