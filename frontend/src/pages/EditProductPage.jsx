// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader, Save, Upload, ArrowLeft } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import useFormInput from "../hooks/useFormInput";
import LoadingSpinner from "../components/LoadingSpinner";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const name = useFormInput("");
  const description = useFormInput("");
  const price = useFormInput("");
  const category = useFormInput("");
  const image = useFormInput("");

  const { product, loading, getProductById, updateProduct } = useProductStore();

  useEffect(() => {
    if (!id) return;
    getProductById(id);
  }, [id, getProductById]);

  useEffect(() => {
    if (!product || product._id !== id) return;
    name.setValue(product.name || "");
    description.setValue(product.description || "");
    price.setValue(product.price ?? "");
    category.setValue(product.category || "");
    image.setValue(product.image || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      image.setValue(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    const ok = await updateProduct(id, {
      name: name.value,
      description: description.value,
      price: price.value,
      category: category.value,
      image: image.value,
    });

    if (ok) {
      navigate("/secret-dashboard");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto mb-6">
          <Link
            to="/secret-dashboard"
            className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </div>

        <motion.div
          className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
            Edit Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                {...name.bind}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                {...description.bind}
                rows="3"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-300"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                {...price.bind}
                step="0.01"
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                {...category.bind}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="image"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image"
                className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Upload className="h-5 w-5 inline-block mr-2" />
                Upload Image
              </label>
              {image.value && (
                <span className="ml-3 text-sm text-gray-400">Image set</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" aria-hidden="true" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProductPage;
