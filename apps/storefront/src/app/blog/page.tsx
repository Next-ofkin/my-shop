import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
    title: "Blog - FreshMarket",
    description: "Recipes, tips, and stories about fresh food and healthy living.",
};

const blogPosts = [
    {
        title: "5 Tips for Storing Fresh Vegetables",
        excerpt: "Keep your produce fresh longer with these simple storage tips.",
        date: "March 10, 2026",
        category: "Tips & Tricks",
        readTime: "3 min read"
    },
    {
        title: "The Benefits of Eating Seasonal Produce",
        excerpt: "Why eating what's in season is better for your health and wallet.",
        date: "March 8, 2026",
        category: "Health",
        readTime: "5 min read"
    },
    {
        title: "Easy Weeknight Dinner Recipes",
        excerpt: "Quick and healthy meals you can make in under 30 minutes.",
        date: "March 5, 2026",
        category: "Recipes",
        readTime: "4 min read"
    },
    {
        title: "Meet Our Local Farmers",
        excerpt: "Learn about the amazing people who grow your food.",
        date: "March 1, 2026",
        category: "Stories",
        readTime: "6 min read"
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-green-950/20 dark:to-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6">
                        <BookOpen className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        FreshMarket <span className="text-green-600">Blog</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Recipes, tips, and stories about fresh food and healthy living.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {blogPosts.map((post, index) => (
                        <article 
                            key={index}
                            className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                                <span className="font-medium">{post.category}</span>
                                <span>•</span>
                                <span>{post.readTime}</span>
                            </div>
                            <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                            <p className="text-sm text-muted-foreground">{post.date}</p>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
