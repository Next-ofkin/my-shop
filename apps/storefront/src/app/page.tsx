import type { Metadata } from "next";
import { HeroSection } from "@/components/layout/hero-section";
import { FeaturedProducts } from "@/components/commerce/featured-products";
import { SITE_NAME, SITE_URL, buildCanonicalUrl } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    Apple, 
    Carrot, 
    Beef, 
    Fish, 
    Milk, 
    Croissant,
    Clock,
    MapPin,
    Award,
    ArrowRight
} from "lucide-react";

export const metadata: Metadata = {
    title: {
        absolute: `${SITE_NAME} - Fresh Organic Food Delivery`,
    },
    description:
        "Shop fresh, organic produce and artisanal foods delivered straight to your door. Locally sourced fruits, vegetables, meats, dairy, and baked goods.",
    alternates: {
        canonical: buildCanonicalUrl("/"),
    },
    openGraph: {
        title: `${SITE_NAME} - Fresh Organic Food Delivery`,
        description:
            "Discover locally sourced, organic produce and artisanal foods. Quality ingredients for a healthier lifestyle.",
        type: "website",
        url: SITE_URL,
    },
};

const categories = [
    { name: "Fresh Fruits", icon: Apple, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", href: "/search?facetValueIds=1" },
    { name: "Vegetables", icon: Carrot, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300", href: "/search?facetValueIds=2" },
    { name: "Meat & Poultry", icon: Beef, color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300", href: "/search?facetValueIds=3" },
    { name: "Seafood", icon: Fish, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", href: "/search?facetValueIds=4" },
    { name: "Dairy & Eggs", icon: Milk, color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300", href: "/search?facetValueIds=5" },
    { name: "Bakery", icon: Croissant, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", href: "/search?facetValueIds=6" },
];

export default async function Home(_props: PageProps<'/'>) {
    return (
        <div className="min-h-screen">
            <HeroSection />
            
            {/* Categories Section */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Browse our wide selection of fresh, organic products sourced from local farmers and artisans
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="group"
                            >
                                <div className="flex flex-col items-center p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors">
                                    <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <category.icon className="w-8 h-8" />
                                    </div>
                                    <span className="font-medium text-center">{category.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <FeaturedProducts />

            {/* Why Choose Us Section */}
            <section className="py-16 bg-gradient-to-b from-green-50/50 to-background dark:from-green-950/20 dark:to-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Why Choose FreshMarket?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We're committed to bringing you the freshest, highest-quality food while supporting local farmers
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-background rounded-2xl p-8 shadow-sm border text-center">
                            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6">
                                <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Same-Day Delivery</h3>
                            <p className="text-muted-foreground">
                                Order before 2 PM for same-day delivery. Fresh produce picked and packed daily.
                            </p>
                        </div>
                        <div className="bg-background rounded-2xl p-8 shadow-sm border text-center">
                            <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-6">
                                <MapPin className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Local Sourcing</h3>
                            <p className="text-muted-foreground">
                                Partnering with local farms within 100 miles to ensure maximum freshness and support our community.
                            </p>
                        </div>
                        <div className="bg-background rounded-2xl p-8 shadow-sm border text-center">
                            <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-6">
                                <Award className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Quality Guarantee</h3>
                            <p className="text-muted-foreground">
                                Not satisfied? We'll replace it or refund you. Every product meets our high quality standards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-16 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Get $20 Off Your First Order
                        </h2>
                        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                            Subscribe to our newsletter for exclusive deals, seasonal recipes, and updates on new local products.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <Button 
                                asChild 
                                size="lg" 
                                variant="secondary"
                                className="gap-2"
                            >
                                <Link href="/search">
                                    Start Shopping
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
