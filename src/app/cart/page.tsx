'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <SectionHeading
            title="Your Cart"
            subtitle="Your cart is empty"
          />
          <div className="text-center">
            <p className="text-botanical-green-700 mb-6">Start shopping to add items to your cart!</p>
            <Button href="/shop" size="lg">
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading
          title="Your Cart"
          subtitle={`${cart.length} ${cart.length === 1 ? 'item' : 'items'}`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-botanical-cream-100 rounded-lg p-6 flex flex-col md:flex-row gap-4"
              >
                <Link href={`/shop/${item.slug}`} className="flex-shrink-0">
                  <div className="relative w-32 h-32 bg-botanical-green-100 rounded-md overflow-hidden">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                </Link>

                <div className="flex-grow">
                  <Link href={`/shop/${item.slug}`}>
                    <h3 className="text-xl font-serif text-botanical-green-900 mb-2 hover:text-botanical-green-700 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-botanical-green-700 text-sm mb-4">{item.category}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <label htmlFor={`qty-${item.id}`} className="text-botanical-green-800 font-semibold">
                        Qty:
                      </label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 rounded-md border border-botanical-green-300 text-botanical-green-900"
                      />
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-serif text-botanical-green-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-botanical-green-600">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-4 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="px-4 py-2 text-botanical-green-700 hover:text-botanical-green-900 underline"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-botanical-green-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-serif text-botanical-green-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-botanical-green-700">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-botanical-green-700">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-botanical-green-300 pt-3 flex justify-between text-xl font-serif text-botanical-green-800">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button href="/checkout" size="lg" className="w-full mb-4">
                Proceed to Checkout
              </Button>

              <Link
                href="/"
                className="block text-center text-botanical-green-600 hover:text-botanical-green-800 underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

