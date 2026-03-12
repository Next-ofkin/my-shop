import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us - FreshMarket",
    description: "Get in touch with FreshMarket. We're here to help with your orders and questions.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-green-950/20 dark:to-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Contact <span className="text-green-600">Us</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Have a question or need help? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border text-center">
                        <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Email</h3>
                        <p className="text-muted-foreground text-sm">
                            support@freshmarket.com
                        </p>
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border text-center">
                        <div className="w-12 h-12 mx-auto bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-4">
                            <Phone className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Phone</h3>
                        <p className="text-muted-foreground text-sm">
                            +234 800 123 4567
                        </p>
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border text-center">
                        <div className="w-12 h-12 mx-auto bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Hours</h3>
                        <p className="text-muted-foreground text-sm">
                            Mon-Sat: 8AM - 6PM
                        </p>
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border text-center">
                        <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Location</h3>
                        <p className="text-muted-foreground text-sm">
                            Lagos, Nigeria
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
