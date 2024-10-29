"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleSignInButton } from "./google-sigin-button";

export function AuthForm() {
    const form = useForm();

    const handleSubmit = form.handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await signIn("email", { email: data.email, redirect: false });
            toast({
                title: "Link de acesso enviado!",
                description: "O link de acesso foi enviado para o seu email.",
            });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: "Erro ao enviar o link!",
                description: "Ocorreu um erro ao enviar o link para o seu email.",
            });
        }
        setIsLoading(false);
    });

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a192f]">
            <Card className="w-[350px] bg-[#112240] border-gray-700 text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-white">
                        Acesso
                    </CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        Acesse sua conta usando somente seu e-mail
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    required
                                    className="bg-[#1e293b] border-gray-700 text-white placeholder-gray-500"
                                    {...form.register("email", {
                                        onChange: (e) => setEmail(e.target.value),
                                    })}
                                />
                            </div>
                            <Button 
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" 
                                type="submit" 
                                disabled={isLoading}
                            >
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <GoogleSignInButton />
                </CardFooter>
            </Card>
        </div>
    );
}