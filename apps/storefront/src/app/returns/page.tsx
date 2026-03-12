import type { Metadata } from "next";
import { RefreshCw, CheckCircle, Clock, Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "Returns & Refunds - FreshMarket",
    description: "Learn about FreshMarket's return policy and refund process.",
};

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-green-950/20 dark:to-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Returns & <span className="text-green-600">Refunds</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Your satisfaction is our priority. Not happy? We'll make it right.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                    <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border text-center">
                        <div className="w-14 h-14 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Quality Guarantee</h3>
                        <p className="text-muted-foreground">
                            If any item doesn't meet your expectations, we'll replace it or refund you.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border text-center">
                        <div className="w-14 h-14 mx-auto bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-7 h-7 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">24-Hour Window</h3>
                        <p className="text-muted-foreground">
                            Contact us within 24 hours of delivery for any quality issues.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border text-center">
                        <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4">
                            <Shield className="w-7 h-7 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Easy Process</h3>
                        <p className="text-muted-foreground">
                            No complicated forms. Just email us with your order number.
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <RefreshCw className="w-6 h-6 text-green-600" />
                        <h2 className="text-2xl font-bold">How Returns Work</h2>
                    </div>
                    
                    <ol className="space-y-4">
                        <li className="flex gap-4">
                            <span className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 font-semibold shrink-0">1</span>
                            <div>
                                <h4 className="font-semibold">Contact Us</h4>
                                <p className="text-muted-foreground">Email support@freshmarket.com within 24 hours of delivery.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <span className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 font-semibold shrink-0">2</span>
                            <div>
                                <h4 className="font-semibold">Describe the Issue</h4>
                                <p className="text-muted-foreground">Include your order number and photos if applicable.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <span className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 font-semibold shrink-0">3</span>
                            <div>
                                <h4 className="font-semibold">Resolution</h4>
                                <p className="text-muted-foreground">We'll offer a replacement, credit, or full refund.</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
