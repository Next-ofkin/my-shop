import { cacheLife } from 'next/cache';
import { getTopCollections } from '@/lib/vendure/cached';
import Image from "next/image";
import Link from "next/link";
import { Leaf, Facebook, Instagram, Twitter } from "lucide-react";

async function Copyright() {
    'use cache'
    cacheLife('days');

    return (
        <div>
            © {new Date().getFullYear()} FreshMarket. All rights reserved.
        </div>
    )
}

export async function Footer() {
    'use cache'
    cacheLife('days');

    const collections = await getTopCollections();

    return (
        <footer className="border-t border-border mt-auto bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 text-xl font-bold mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                FreshMarket
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">
                            Fresh, organic produce and artisanal foods delivered to your door. Supporting local farmers since 2024.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <p className="text-sm font-semibold mb-4 uppercase tracking-wider">
                            Categories
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {collections.slice(0, 6).map((collection) => (
                                <li key={collection.id}>
                                    <Link
                                        href={`/collection/${collection.slug}`}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {collection.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <p className="text-sm font-semibold mb-4 uppercase tracking-wider">
                            Company
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/about" className="hover:text-foreground transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-foreground transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-foreground transition-colors">
                                    Recipes & Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <p className="text-sm font-semibold mb-4 uppercase tracking-wider">
                            Support
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/shipping" className="hover:text-foreground transition-colors">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="hover:text-foreground transition-colors">
                                    Returns & Refunds
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-foreground transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-foreground transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div
                    className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
                >
                    <Copyright />
                    <div className="flex items-center gap-2">
                        <span>Fresh & Local. Delivered with care.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
