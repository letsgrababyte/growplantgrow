'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <SectionHeading
            title="Checkout"
            subtitle="Your cart is empty"
          />
          <div className="text-center">
            <Button href="/shop" size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <SectionHeading
          title="Checkout"
          subtitle="Complete your purchase"
        />

        <div className="bg-botanical-cream-100 rounded-lg p-8">
          <div className="mb-6">
            <h3 className="text-xl font-serif text-botanical-green-800 mb-4">
              Order Summary
            </h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-botanical-green-700">
                  <span>{item.title} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-botanical-green-300 mt-4 pt-4 flex justify-between text-xl font-serif text-botanical-green-800">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-botanical-green-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-serif text-botanical-green-800 mb-4">
              Payment Information
            </h3>
            <p className="text-botanical-green-700 mb-4">
              For now, please complete your purchase through our Etsy store or use the individual
              product buy buttons which link to Lemon Squeezy checkout.
            </p>
            <a
              href="https://etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-botanical-green-600 text-botanical-cream-50 rounded-md hover:bg-botanical-green-700 transition-colors"
            >
              Complete Purchase on Etsy
            </a>
          </div>

          <div className="text-center">
            <Link
              href="/cart"
              className="text-botanical-green-600 hover:text-botanical-green-800 underline"
            >
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

