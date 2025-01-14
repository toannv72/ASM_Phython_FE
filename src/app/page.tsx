"use client";
import CategoryPreviews from "@/components/CategoryPreviews";
import Link from "next/link";
import { useEffect, useState } from "react";
// Định nghĩa type cho dữ liệu gốc từ API
type RawProduct = {
  id: number;
  name: string;
  price: number; // giá từ API có thể là số
  description: string;
  category: { name: string }; // API có object category
  images: { image: string }[]; // API trả về mảng images
};

// Định nghĩa type cho sản phẩm sau khi xử lý
type Product = {
  id: number;
  name: string;
  href: string;
  price: string; // Giá đã được định dạng thành chuỗi
  description: string;
  options: string;
  imageSrc: string;
  imageAlt: string;
};

export default function Home() {
  // Sử dụng type đã định nghĩa
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch(
        "http://127.0.0.1:8000/products/manage-products/?format=json"
      );
      const data: RawProduct[] = await response.json(); // Định kiểu cho dữ liệu gốc
      const formattedProducts: Product[] = data.map((product) => ({
        id: product.id,
        name: product.name,
        href: `product/${product.id}`,
        price: `$${product.price}`, // Định dạng giá thành chuỗi
        description: product.description,
        options: product.category.name,
        imageSrc: product.images[0]?.image || "", // Xử lý hình ảnh
        imageAlt: product.name,
      }));
      setProducts(formattedProducts);
    }

    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      <CategoryPreviews />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl pb-2 font-bold tracking-tight text-gray-900">
          Products
        </h2>
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="aspect-[3/4] w-full bg-gray-200 object-cover group-hover:opacity-75 sm:aspect-auto sm:h-96"
              />
              <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  <Link href={product.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500">{product.description}</p>
                <div className="flex flex-1 flex-col justify-end">
                  <p className="text-sm italic text-gray-500">
                    {product.options}
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {product.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
