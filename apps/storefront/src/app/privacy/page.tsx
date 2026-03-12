import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - FreshMarket",
    description: "Learn how FreshMarket protects your personal information and data.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-green-950/20 dark:to-background">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
                        Privacy <span className="text-green-600">Policy</span>
                    </h1>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-muted-foreground mb-6">
                            Last updated: March 12, 2026
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                            <p className="text-muted-foreground mb-4">
                                We collect information you provide directly to us, including:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Name and contact information</li>
                                <li>Delivery addresses</li>
                                <li>Payment information (processed securely by Paystack)</li>
                                <li>Order history and preferences</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground mb-4">
                                We use your information to:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Process and deliver your orders</li>
                                <li>Communicate about your orders</li>
                                <li>Improve our products and services</li>
                                <li>Send promotional offers (with your consent)</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">3. Information Security</h2>
                            <p className="text-muted-foreground">
                                We implement appropriate security measures to protect your personal information. 
                                Payment processing is handled securely by Paystack. We do not store your full 
                                credit card details on our servers.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">4. Contact Us</h2>
                            <p className="text-muted-foreground">
                                If you have any questions about this Privacy Policy, please contact us at:
                                privacy@freshmarket.com
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
