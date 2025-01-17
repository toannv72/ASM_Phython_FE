"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { Cart } from "@/lib/users";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
  const router = useRouter();
  const [cart, setCart] = useStorage<Cart[]>("cart", []);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      const resolvedParams = await params;

      try {
        const response = await axios.get(
          `https://gl03.sangtran.dev/products/manage-product/${resolvedParams.id}/?format=json`
        );
        const data = response.data;

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchProduct();
  }, []);

  const handleQuantityChange = (type: "increment" | "decrement") => {
    setQuantity((prev) => {
      if (type === "increment" && product && prev < product.quantity) {
        return prev + 1;
      } else if (type === "decrement" && prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  const handleInputChange = (value: string) => {
    // Kiểm tra nếu giá trị là số nguyên dương
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      setQuantity(Math.min(num, product?.quantity || 1)); // Không vượt quá số lượng sản phẩm
    } else {
      setQuantity(0); // Cho phép xóa toàn bộ nội dung
    }
  };

  const handleInputBlur = () => {
    // Nếu ô nhập trống hoặc nhỏ hơn 1, đặt lại giá trị về 1
    if (quantity < 1) {
      setQuantity(1);
    }
  };

  const handleCheckout = () => {
    if (!product) return;
    // Chuyển hướng sang trang `/checkout` với dữ liệu sản phẩm và số lượng 
    router.push(
      `/checkout?products=${encodeURIComponent(
        JSON.stringify([{ ...product, quantity }])
      )}`
    );
  };

  const handleAddCart = () => {
    if (!product) return;
    const existingProduct = cart.find((p) => p.id === product?.id);
    if (existingProduct) {
      toast({
        title: "Add Product",
        description: "The product has been added to the cart.",
      });
      return setCart(
        cart.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + quantity, selected: false }
            : p
        )
      );
    }
    toast({
      title: "Add Product",
      description: "The product has been added to the cart.",
    });

    return setCart([
      ...cart,
      {
        ...product,
        price: product.price.toString(),
        quantity,
        selected: false,
      },
    ]);
  };
  if (!product) {
    return (
      <div className="flex flex-col space-y-3 justify-center items-center">
        <Skeleton className="h-[40vh] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {product.images.map((image) => (
                  <Tab
                    key={image.id}
                    className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-500/50 focus:ring-offset-4"
                  >
                    <span className="sr-only">{image.image}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <img
                        alt={image.image}
                        src={image.image}
                        className="size-full object-cover"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-500"
                    />
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels>
              {product.images.map((image) => (
                <TabPanel key={image.id}>
                  <img
                    alt={image.image}
                    src={image.image}
                    className="aspect-square w-full object-cover sm:rounded-lg"
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <p className="text-3xl tracking-tight text-gray-900">
                {product.price}
              </p>
            </div>

            <div className="mt-6">
              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                className="space-y-6 text-base text-gray-700"
              />
            </div>
            <div className="mt-3">
              <p className="tracking-tight text-gray-700">
                In stock: {product.quantity}
              </p>
            </div>
            {/* Quantity controls */}
            <div className="mt-6 flex items-center">
              <button
                type="button"
                onClick={() => handleQuantityChange("decrement")}
                className="px-4 py-2 text-gray-500 border rounded-l-md"
                disabled={quantity === 1}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={handleInputBlur}
                className="w-20 h-[41px] text-center border-t border-b"
                min={1}
                max={product.quantity}
              />
              <button
                type="button"
                onClick={() => handleQuantityChange("increment")}
                className="px-4 py-2 text-gray-500 border rounded-r-md"
                disabled={quantity === product.quantity}
              >
                +
              </button>
            </div>

            <div className="mt-10  ">
              {product.quantity > 0 ? (
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Buy now
                </button>
              ) : (
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center rounded-md bg-gray-300 px-8 py-3 text-base font-medium text-white cursor-not-allowed sm:w-full"
                  disabled
                >
                  Out of stock
                </button>
              )}
              {product.quantity > 0 && (
                <button
                  type="button"
                  onClick={handleAddCart}
                  className="flex flex-1 mt-4 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
