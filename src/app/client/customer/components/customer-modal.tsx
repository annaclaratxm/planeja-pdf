'use client';

import { Switch } from "@/components/ui/switch";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';
import { upsertCustomer } from '@/services/api/customer/actions';
import { Customer } from '@/services/api/customer/types';

// Funções de formatação
function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
        return numbers.replace(/(\d{2})?(\d{2})?(\d{5})?(\d{4})?/, (_, p1, p2, p3, p4) => {
            let output = '';
            if (p1) output += `+${p1} `;
            if (p2) output += `(${p2}) `;
            if (p3) output += `${p3}`;
            if (p4) output += `-${p4}`;
            return output;
        });
    }
    return value;
}

function formatCPF(value: string) {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})?(\d{3})?(\d{3})?(\d{2})?/, (_, p1, p2, p3, p4) => {
        let output = '';
        if (p1) output += p1;
        if (p2) output += `.${p2}`;
        if (p3) output += `.${p3}`;
        if (p4) output += `-${p4}`;
        return output;
    });
}

function formatCNPJ(value: string) {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})?(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, (_, p1, p2, p3, p4, p5) => {
        let output = '';
        if (p1) output += p1;
        if (p2) output += `.${p2}`;
        if (p3) output += `.${p3}`;
        if (p4) output += `/${p4}`;
        if (p5) output += `-${p5}`;
        return output;
    });
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'O nome precisa ter ao menos dois caracteres.',
    }),
    phone: z.string().min(14, {
        message: 'Digite um número de telefone válido.',
    }),
    email: z.string().email({
        message: 'Por favor, insira um e-mail válido.',
    }).optional().or(z.literal('')),
    birthdate: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), {
        message: 'Por favor, insira uma data válida.',
    }),
    isCNPJ: z.boolean().default(false),
    cnpjOrCpf: z.string().optional().refine((val) => {
        if (!val) return true;
        const numbers = val.replace(/\D/g, '');
        return (numbers.length === 14 || numbers.length === 11);
    }, {
        message: 'Digite um documento válido.',
    }),
    address: z.string().optional(),
});

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | undefined;
}

export function CustomerModal({
    isOpen,
    onClose,
    customer,
}: CustomerModalProps) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            birthdate: '',
            isCNPJ: false,
            cnpjOrCpf: '',
            address: '',
        },
    });

    useEffect(() => {
        if (customer) {
            form.reset({
                name: customer.name,
                phone: formatPhone(customer.phone),
                email: customer.email || '',
                birthdate: customer.birthdate
                    ? new Date(customer.birthdate).toISOString().split('T')[0]
                    : '',
                isCNPJ: Boolean(customer.cnpj),
                cnpjOrCpf: customer.cnpj ? formatCNPJ(customer.cnpj) : customer.cpf ? formatCPF(customer.cpf) : '',
                address: customer.address || '',
            });
        } else {
            form.reset({
                name: '',
                phone: '',
                email: '',
                birthdate: '',
                isCNPJ: false,
                cnpjOrCpf: '',
                address: '',
            });
        }
    }, [customer, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const customerData = {
                ...values,
                phone: values.phone.replace(/\D/g, ''),
                cnpjOrCpf: values.cnpjOrCpf?.replace(/\D/g, ''),
                cnpj: values.isCNPJ ? values.cnpjOrCpf?.replace(/\D/g, '') : undefined,
                cpf: values.isCNPJ ? undefined : values.cnpjOrCpf?.replace(/\D/g, ''),
            };

            if (customer) {
                await upsertCustomer({
                    ...customerData,    
                    id: customer.id,
                    birthdate: values.birthdate ? new Date(values.birthdate) : undefined,
                });
                toast({
                    title: 'Cliente Atualizado',
                    description: 'O cliente foi atualizado com sucesso.',
                });
            } else {
                await upsertCustomer({
                    ...customerData,
                    birthdate: values.birthdate ? new Date(values.birthdate) : undefined,
                });

                toast({
                    title: 'Cliente cadastrado',
                    description: 'O cliente foi criado com sucesso.',
                });
            }
            onClose();
            window.location.reload();
        } catch {
            toast({
                title: 'Erro',
                description: 'Ocorreu um erro ao salvar o cliente.',
                variant: 'destructive',
            });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0a192f] border-0 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Cadastro de cliente
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nome completo"
                                                {...field}
                                                className="bg-[#132236] border-0 text-white placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field: { onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Telefone</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+55 (00) 00000-0000"
                                                {...field}
                                                onChange={(e) => {
                                                    onChange(formatPhone(e.target.value));
                                                }}
                                                className="bg-[#132236] border-0 text-white placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0"
                                            />
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
                                        <FormLabel className="text-white">Endereço de e-mail</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="exemplo@exemplo.com"
                                                {...field}
                                                className="bg-[#132236] border-0 text-white placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0"
                                            />
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
                                        <FormLabel className="text-white">Data de nascimento</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                className="bg-[#132236] border-0 text-white placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isCNPJ"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-white">Tipo de Documento</FormLabel>
                                            <FormDescription className="text-gray-400">
                                                {field.value ? 'CNPJ' : 'CPF'}
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cnpjOrCpf"
                                render={({ field: { onChange, value, ...field } }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">{form.watch('isCNPJ') ? 'CNPJ' : 'CPF'}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={form.watch('isCNPJ') ? '00.000.000/0000-00' : '000.000.000-00'}
                                                {...field}
                                                value={value}
                                                onChange={(e) => {
                                                    const formatted = form.watch('isCNPJ')
                                                        ? formatCNPJ(e.target.value)
                                                        : formatCPF(e.target.value);
                                                    onChange(formatted);
                                                }}
                                                className="bg-[#132236] border-0 text-white placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-white">Endereço</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Rua, número, bairro, cidade, estado"
                                                {...field}
                                                className="bg-[#132236] border-0 text-white placeholder:text-gray-400 focus:ring-1 focus:ring-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-0"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </ScrollArea>
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(onSubmit)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                    >
                        Salvar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}