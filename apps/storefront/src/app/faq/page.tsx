import type { Metadata } from "next";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "FAQ - FreshMarket",
    description: "Frequently asked questions about FreshMarket's delivery, products, and services.",
};

const faqs = [
    {
        question: "How fresh is your produce?",
        answer: "Our produce is harvested daily and delivered within 24 hours. We work directly with local farms to ensure maximum freshness."
    },
    {
        question: "What areas do you deliver to?",
        answer: "We currently deliver to Lagos and surrounding areas. Enter your address at checkout to see if we deliver to your location."
    },
    {
        question: "What is your delivery schedule?",
        answer: "We deliver Tuesday through Sunday. Same-day delivery is available for orders placed before 2 PM."
    },
    {
        question: "How do I track my order?",
        answer: "Once your order is dispatched, you'll receive an email with tracking information. You can also check your order status in your account."
    },
    {
        question: "What if I'm not satisfied with my order?",
        answer: "We offer a 100% satisfaction guarantee. If you're not happy with any item, contact us within 24 hours for a refund or replacement."
    },
    {
        question: "Do you offer organic produce?",
        answer: "Yes! We have a wide selection of certified organic products. Look for the organic label on product pages."
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-green-950/20 dark:to-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6">
                        <HelpCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Frequently Asked <span className="text-green-600">Questions</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Everything you need to know about FreshMarket.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border"
                        >
                            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                            <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
