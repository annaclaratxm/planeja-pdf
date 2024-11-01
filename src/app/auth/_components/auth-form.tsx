"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { GoogleSignInButton } from "./google-sigin-button";

export function AuthForm() {

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a192f]">
            <Card className="w-[350px] bg-[#112240] border-gray-700 text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-white">
                        Acesso
                    </CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        Acesse sua conta usando somente seu gmail
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <GoogleSignInButton />
                </CardContent>
            </Card>
        </div>
    );
}