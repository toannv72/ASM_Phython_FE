"use client";

import { postData } from "@/api/api";
import { useStorage } from "@/hooks/useLocalStorage";
import { Product } from "@/lib/product";
import { UserLogin } from "@/lib/users";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutForms() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [user] = useStorage<UserLogin>("user", {
    refresh: "",
    access: "",
    userid: 0,
    username: "",
    email: "",
    phone: "",
    address: "",
    status: "",
    accountid: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    notes: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const productsData = searchParams.get("products");
    if (productsData) {
      setProducts(JSON.parse(decodeURIComponent(productsData)));
    }
  }, [searchParams]);

  const totalAmount = products.reduce((sum, product) => {
    return (
      sum +
      parseFloat(product.price.toString().replace("$", "")) * product.quantity
    );
  }, 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { name, address, phone, notes, terms } = formData;
    if (!name || !address || !phone || !notes) {
      setError("Please fill in all the required fields.");
      return;
    }
    if (!terms) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      console.log({
        order_details: products.map((product) => ({
          quantity: product.quantity,
          price: product.price.toString().replace("$", ""),
          productId: product.id,
        })),
        amount: totalAmount,
        description: "Order description",
        content: "Order content",
        notes: notes,
        method: "vnpay",
        redirect_url: "https://asm-phython-fe.vercel.app/order",
        accountId: user.userid,
      });

      postData("/orders/manage-order/", {
        order_details: products.map((product) => ({
          quantity: product.quantity,
          price: product.price.toString().replace("$", ""),
          productId: product.id,
        })),
        amount: totalAmount,
        description: "Order description",
        content: "Order content",
        notes: notes,
        method: "vnpay",
        redirect_url: "https://asm-phython-fe.vercel.app/order",
        accountId: user.userid,
      })
        .then((response) => {
          const data = response as { payment_url: string };
          if (!data.payment_url) return;
          window.location.href = data.payment_url;
        })
        .catch((error) => {
          console.error("Error placing order:", error);
          setError("Failed to place the order. Please try again.");
        });
      // Redirect to order confirmation page
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-8 lg:px-8 xl:px-2 xl:pt-14">
        <h1 className="sr-only">Checkout</h1>
        <div className="mx-auto grid max-w-lg grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          {/* Order Summary */}
          <div className="mx-auto w-full max-w-lg">
            <h2 className="sr-only">Order summary</h2>
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product.id} className="flex space-x-6 py-6">
                  <img
                    alt={product.name}
                    src={product.images[0]?.image || "/fallback-image.png"}
                    className="size-24 flex-none rounded-md bg-gray-100 object-cover"
                  />
                  <div className="flex-auto">
                    <h3 className="text-gray-900">
                      <Link href={`/product/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-gray-900">{product.price}</p>
                    <p className="text-gray-500">
                      Quantity: {product.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-gray-900">${totalAmount.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-6 text-gray-900">
                <dt className="text-base">Total</dt>
                <dd className="text-base">${totalAmount.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          {/* Checkout Form */}
          <div className="mx-auto w-full max-w-lg">
            <form onSubmit={handleSubmit} className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">
                Contact information
              </h2>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <div className="mt-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
              <div className="mt-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
              <div className="mt-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
              <div className="mt-6">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                ></textarea>
              </div>
              <div className="mt-6 flex gap-3 items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions.
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm text-white ${
                  loading ? "opacity-50" : "hover:bg-indigo-700"
                }`}
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
