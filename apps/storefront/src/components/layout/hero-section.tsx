"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Truck, ShieldCheck } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-[600px] flex items-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-green-50 dark:from-orange-950/30 dark:via-amber-950/20 dark:to-green-950/30" />
            
            {/* Decorative elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200/30 dark:bg-orange-800/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-200/30 dark:bg-green-800/20 rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-sm font-medium mb-6">
                            <Leaf className="w-4 h-4" />
                            Farm to Table Freshness
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-green-600 bg-clip-text text-transparent">
                            Fresh & Organic
                        </span>
                        <br />
                        <span className="text-foreground">Delivered to You</span>
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Discover locally sourced, organic produce and artisanal foods. 
                        Quality ingredients for a healthier lifestyle.
                    </motion.p>
                    
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Button 
                            asChild 
                            size="lg" 
                            className="min-w-[200px] bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white border-0"
                        >
                            <Link href="/search" className="gap-2">
                                Shop Fresh Produce
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button 
                            asChild 
                            variant="outline" 
                            size="lg" 
                            className="min-w-[200px] border-2"
                        >
                            <Link href="/search">
                                View Bestsellers
                            </Link>
                        </Button>
                    </motion.div>
                    
                    {/* Trust badges */}
                    <motion.div 
                        className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-green-600" />
                            <span>100% Organic</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-orange-600" />
                            <span>Free Delivery Over $50</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-amber-600" />
                            <span>Quality Guaranteed</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
