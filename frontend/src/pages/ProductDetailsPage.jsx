import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { getProductById, product, loading } = useProductStore();
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    getProductById(id);
  }, [id, getProductById]);

  if (loading) return <LoadingSpinner />;

  if (!product) {
    return (
      <div className="min-h-screen">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-white">Product not found</h1>
            <p className="mt-3 text-gray-300">
              The product you are looking for doesn&apos;t exist (or was
              removed).
            </p>
            <Link
              to="/"
              className="inline-block mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    }
    addToCart(product);
  };

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">
            <div className="w-full overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[420px] object-cover"
              />
            </div>
          </div>

          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-emerald-400">
                ${product.price}
              </p>
              {product.category && (
                <span className="text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-full">
                  {product.category.toUpperCase()}
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-6 text-gray-300 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                className="flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
