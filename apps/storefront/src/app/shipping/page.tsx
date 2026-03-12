import type { Metadata } from "next";
import { Truck, Clock, MapPin, Package } from "lucide-react";

export const metadata: Metadata = {
    title: "Shipping Information - FreshMarket",
    description: "Learn about FreshMarket's delivery options, shipping rates, and delivery schedule.",
};

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-green-950/20 dark:to-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Shipping & <span className="text-green-600">Delivery</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Fast, reliable delivery of fresh produce to your doorstep.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                    <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                            <Truck className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Delivery Options</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Same-day delivery (order before 2 PM)</li>
                            <li>• Next-day delivery</li>
                            <li>• Scheduled delivery</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Delivery Hours</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Tuesday - Sunday</li>
                            <li>• 9:00 AM - 6:00 PM</li>
                            <li>• Closed on Mondays</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Delivery Areas</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Lagos Island</li>
                            <li>• Lagos Mainland</li>
                            <li>• Surrounding areas</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Packaging</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• Eco-friendly packaging</li>
                            <li>• Temperature-controlled</li>
                            <li>• Reusable containers</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-green-600 text-white rounded-2xl p-8 max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">Free Delivery</h2>
                    <p className="text-lg">
                        Enjoy free delivery on all orders over ₦15,000 or $50!
                    </p>
                </div>
            </div>
        </div>
    );
}
