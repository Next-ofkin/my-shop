import type {Metadata} from 'next';
import {query} from '@/lib/vendure/api';
import {
    GetActiveOrderForCheckoutQuery,
    GetCustomerAddressesQuery,
    GetEligiblePaymentMethodsQuery,
    GetEligibleShippingMethodsQuery,
} from '@/lib/vendure/queries';
import {redirect} from 'next/navigation';
import CheckoutFlow from './checkout-flow';
import {CheckoutProvider} from './checkout-provider';
import {noIndexRobots} from '@/lib/metadata';
import {getActiveCustomer} from '@/lib/vendure/actions';
import {getAvailableCountriesCached} from '@/lib/vendure/cached';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your purchase.',
    robots: noIndexRobots(),
};

export default async function CheckoutPage(_props: PageProps<'/checkout'>) {
    try {
        const customer = await getActiveCustomer();
        const isGuest = !customer;

        let orderRes, addressesRes, countries, shippingMethodsRes, paymentMethodsRes;

        try {
            [orderRes, addressesRes, countries, shippingMethodsRes, paymentMethodsRes] =
                await Promise.all([
                    query(GetActiveOrderForCheckoutQuery, {}, {useAuthToken: true}),
                    isGuest
                        ? Promise.resolve({ data: { activeCustomer: null } })
                        : query(GetCustomerAddressesQuery, {}, {useAuthToken: true}),
                    getAvailableCountriesCached().catch(() => []),
                    query(GetEligibleShippingMethodsQuery, {}, {useAuthToken: true}),
                    query(GetEligiblePaymentMethodsQuery, {}, {useAuthToken: true}),
                ]);
        } catch (error: any) {
            console.error('Checkout data fetch error:', error);
            return (
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Checkout Temporarily Unavailable</h1>
                    <p className="text-muted-foreground mb-6">
                        We&apos;re having trouble loading checkout. Please try again in a moment.
                    </p>
                    <a href="/cart" className="text-green-600 hover:underline">
                        Return to Cart
                    </a>
                </div>
            );
        }

        const activeOrder = orderRes?.data?.activeOrder;

        if (!activeOrder || activeOrder.lines.length === 0) {
            return redirect('/cart');
        }

        if (activeOrder.state !== 'AddingItems' && activeOrder.state !== 'ArrangingPayment') {
            return redirect(`/order-confirmation/${activeOrder.code}`);
        }

        const addresses = addressesRes?.data?.activeCustomer?.addresses || [];
        const shippingMethods = shippingMethodsRes?.data?.eligibleShippingMethods || [];
        const paymentMethods =
            paymentMethodsRes?.data?.eligiblePaymentMethods?.filter((m) => m.isEligible) || [];

        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                <CheckoutProvider
                    order={activeOrder}
                    addresses={addresses}
                    countries={countries || []}
                    shippingMethods={shippingMethods}
                    paymentMethods={paymentMethods}
                    isGuest={isGuest}
                >
                    <CheckoutFlow/>
                </CheckoutProvider>
            </div>
        );
    } catch (error: any) {
        console.error('Checkout page error:', error);
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                <p className="text-muted-foreground mb-6">
                    We&apos;re having trouble loading checkout. Please try again.
                </p>
                <a href="/cart" className="text-green-600 hover:underline">
                    Return to Cart
                </a>
            </div>
        );
    }
}
