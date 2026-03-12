import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service - FreshMarket",
    description: "Terms and conditions for using FreshMarket's services.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-green-950/20 dark:to-background">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                        Terms of <span className="text-green-600">Service</span>
                    </h1>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-muted-foreground mb-6">
                            Last updated: March 12, 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground">
                                By accessing and using FreshMarket's services, you agree to be bound by these 
                                Terms of Service. If you do not agree with any part of these terms, please 
                                do not use our services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">2. Orders and Delivery</h2>
                            <p className="text-muted-foreground mb-4">
                                All orders are subject to product availability. We reserve the right to 
                                limit quantities or cancel orders at our discretion. Delivery times are 
                                estimates and may vary based on location and circumstances.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">3. Pricing and Payment</h2>
                            <p className="text-muted-foreground mb-4">
                                All prices are listed in Nigerian Naira (NGN) or US Dollars (USD) and are 
                                inclusive of applicable taxes unless stated otherwise. Payment is processed 
                                securely through Paystack.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">4. Quality Guarantee</h2>
                            <p className="text-muted-foreground">
                                We stand behind the quality of our products. If you are not satisfied with 
                                any item, please contact us within 24 hours of delivery for a replacement 
                                or refund.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
                            <p className="text-muted-foreground">
                                For any questions regarding these Terms of Service, please contact us at:
                                legal@freshmarket.com
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
