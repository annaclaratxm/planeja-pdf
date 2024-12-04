"use client"

import { FileSpreadsheet, FileText, Home, LogOut, Menu, Settings, Users, Wallet } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

export default function MainNavBar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const routes = [
        {
            name: "Início",
            href: "/client",
            icon: Home,
        },
        {
            name: "Orçamentos",
            href: "/client/budget",
            icon: FileSpreadsheet,
        },
        {
            name: "Clientes",
            href: "/client/customer",
            icon: Users,
        },
        {
            name: "Configurações",
            href: "/client/settings",
            icon: Settings,
        },
        {
            name: "Assinatura",
            href: "/client/payment",
            icon: Wallet,
        },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-[#112240] shadow-sm">
            <nav className="container flex h-16 items-center justify-between">
                <Link href="/client" className="flex items-center space-x-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-xl font-bold">PlanejaPDF</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:space-x-6">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[#1d3a6e]",
                                pathname === route.href ? "bg-[#1d3a6e]" : "transparent"
                            )}
                        >
                            <route.icon className="h-4 w-4" />
                            <span>{route.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Mobile Navigation */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-white">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] bg-[#112240] p-0">
                        <SheetHeader className="border-b border-[#1d3a6e] p-6">
                            <SheetTitle className="flex items-center space-x-2 text-white">
                                <FileText className="h-6 w-6" />
                                <span>PlanejaPDF</span>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col space-y-2 p-6">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[#1d3a6e]",
                                        pathname === route.href ? "bg-[#1d3a6e]" : "transparent"
                                    )}
                                >
                                    <route.icon className="h-4 w-4" />
                                    <span>{route.name}</span>
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Sign Out Button */}
                <Button
                    variant="destructive"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => {
                        signOut({
                            callbackUrl: "/auth",
                        })
                    }}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                </Button>
            </nav>
        </header>
    )
}

