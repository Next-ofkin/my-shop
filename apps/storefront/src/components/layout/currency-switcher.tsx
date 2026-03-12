"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DollarSign, Coins } from "lucide-react";

const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
    { code: "NGN", symbol: "₦", name: "Nigerian Naira", flag: "🇳🇬" },
];

export function CurrencySwitcher() {
    const [currency, setCurrency] = useState<string>("USD");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load from localStorage
        const saved = localStorage.getItem("currency");
        if (saved) {
            setCurrency(saved);
        }
    }, []);

    const handleCurrencyChange = (code: string) => {
        setCurrency(code);
        localStorage.setItem("currency", code);
        // Reload page to apply new currency
        window.location.reload();
    };

    const currentCurrency = currencies.find((c) => c.code === currency) || currencies[0];

    if (!mounted) {
        return (
            <Button variant="ghost" size="sm" className="gap-2">
                <DollarSign className="w-4 h-4" />
                USD
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <span className="text-lg">{currentCurrency.flag}</span>
                    <span className="hidden sm:inline">{currentCurrency.code}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {currencies.map((c) => (
                    <DropdownMenuItem
                        key={c.code}
                        onClick={() => handleCurrencyChange(c.code)}
                        className="gap-3 cursor-pointer"
                    >
                        <span className="text-lg">{c.flag}</span>
                        <div className="flex flex-col">
                            <span className="font-medium">{c.code}</span>
                            <span className="text-xs text-muted-foreground">{c.name}</span>
                        </div>
                        {currency === c.code && (
                            <span className="ml-auto text-green-600">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
