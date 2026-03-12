import type {Metadata, Viewport} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";
import {Navbar} from "@/components/layout/navbar";
import {Footer} from "@/components/layout/footer";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {SITE_NAME, SITE_URL} from "@/lib/metadata";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} - Fresh Organic Food Delivery`,
        template: `%s | ${SITE_NAME}`,
    },
    description:
        "Shop fresh, organic produce and artisanal foods delivered straight to your door. Locally sourced fruits, vegetables, meats, dairy, and baked goods.",
    keywords: ["fresh food", "organic produce", "grocery delivery", "local farmers", "artisanal food"],
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        locale: "en_US",
        title: `${SITE_NAME} - Fresh Organic Food Delivery`,
        description: "Shop fresh, organic produce and artisanal foods delivered straight to your door.",
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} - Fresh Organic Food Delivery`,
        description: "Shop fresh, organic produce and artisanal foods delivered straight to your door.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "#ffffff"},
        {media: "(prefers-color-scheme: dark)", color: "#0f172a"},
    ],
};

export default function RootLayout({children}: LayoutProps<'/'>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
            >
                <ThemeProvider>
                    <Navbar />
                    <main className="pt-16">
                        {children}
                    </main>
                    <Footer />
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
