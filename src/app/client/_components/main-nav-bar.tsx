"use client"

import { FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import router from "next/router"

export default function MainNavBar() {
    const pathname = usePathname()

    const routes = [
        {
            name: "Início",
            href: "/client",
        },
        {
            name: "Orçamentos",
            href: "/client/budget",
        },
        {
            name: "Clientes",
            href: "/client/customer",
        },
        {
            name: "Configurações",
            href: "/client/settings",
        }
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-[#112240] shadow-sm">
            <div className="container flex h-16 items-center">
                <Link href="/client" className="mr-8 flex items-center space-x-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-xl font-bold">PlanejaPDF</span>
                </Link>
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        {routes.map((route) => (
                            <NavigationMenuItem key={route.href}>
                                <Link href={route.href} legacyBehavior passHref>
                                    <NavigationMenuLink
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            "bg-transparent hover:bg-[#1d3a6e] data-[active]:bg-[#1d3a6e]",
                                            pathname === route.href && "bg-[#1d3a6e]"
                                        )}
                                    >
                                        {route.name}
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
                <div className="ml-auto flex items-center space-x-4">
                    <Button
                        variant="destructive"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => {
                            signOut();
                            router.push("/auth/signin");
                        }}
                    >
                        Sair
                    </Button>
                </div>
            </div>
        </header>
    )
}