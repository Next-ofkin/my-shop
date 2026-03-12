import type { Metadata } from "next";
import { Leaf, Heart, Truck, Award } from "lucide-react";

export const metadata: Metadata = {
    title: "About Us - FreshMarket",
    description: "Learn about FreshMarket's mission to deliver fresh, organic food to your doorstep.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-green-950/20 dark:to-background">
            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        About <span className="text-green-600">FreshMarket</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Bringing farm-fresh, organic produce directly to your table. 
                        We believe everyone deserves access to healthy, quality food.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border text-center">
                        <div className="w-14 h-14 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                            <Heart className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                        <p className="text-muted-foreground">
                            To make fresh, organic food accessible to everyone while supporting local farmers 
                            and sustainable agriculture.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border text-center">
                        <div className="w-14 h-14 mx-auto bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-4">
                            <Truck className="w-7 h-7 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
                        <p className="text-muted-foreground">
                            Same-day delivery for orders before 2 PM. We ensure your produce stays 
                            fresh from farm to your doorstep.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border text-center">
                        <div className="w-14 h-14 mx-auto bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4">
                            <Award className="w-7 h-7 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                        <p className="text-muted-foreground">
                            Every product meets our strict quality standards. Not satisfied? 
                            We offer a 100% money-back guarantee.
                        </p>
                    </div>
                </div>

                {/* Story Section */}
                <div className="bg-white dark:bg-card rounded-3xl p-8 md:p-12 shadow-sm border">
                    <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
                    <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
                        <p>
                            FreshMarket was founded in 2024 with a simple idea: everyone deserves access to 
                            fresh, healthy food. What started as a small local delivery service has grown 
                            into a trusted marketplace connecting farmers with families.
                        </p>
                        <p>
                            We partner with over 50 local farms within 100 miles of our distribution centers, 
                            ensuring that the produce you receive was harvested at peak freshness. By cutting 
                            out the middlemen, we can offer better prices to customers while paying farmers 
                            fairly.
                        </p>
                        <p>
                            Today, we serve thousands of happy customers who trust us with their weekly grocery 
                            needs. Join us in our mission to make healthy eating easy and accessible.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
