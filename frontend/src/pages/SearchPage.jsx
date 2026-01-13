import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import useDebounce from "../hooks/useDebounce";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  "",
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const sortOptions = [
  { value: "-createdAt", label: "Newest (default)" },
  { value: "createdAt", label: "Oldest" },
  { value: "name", label: "Name (A-Z)" },
  { value: "-name", label: "Name (Z-A)" },
  { value: "price", label: "Price (low-high)" },
  { value: "-price", label: "Price (high-low)" },
];

const operators = ["<", "<=", "=", ">=", ">"];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, searchMeta, searchProducts } = useProductStore();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "-createdAt");
  const [priceOperator, setPriceOperator] = useState(
    searchParams.get("priceOperator") || "<"
  );
  const [priceValue, setPriceValue] = useState(searchParams.get("price") || "");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const debouncedName = useDebounce(name, 400);
  const debouncedPrice = useDebounce(priceValue, 400);

  useEffect(() => {
    searchProducts({
      name: debouncedName.trim(),
      category,
      sort,
      priceOperator,
      priceValue: debouncedPrice,
      page,
      limit: 20,
    });
  }, [
    searchProducts,
    debouncedName,
    category,
    sort,
    priceOperator,
    debouncedPrice,
    page,
  ]);

  useEffect(() => {
    const params = {};

    if (debouncedName.trim()) params.name = debouncedName.trim();
    if (category) params.category = category;
    if (sort && sort !== "-createdAt") params.sort = sort;

    if (debouncedPrice !== "" && debouncedPrice !== null) {
      params.priceOperator = priceOperator;
      params.price = debouncedPrice;
    }

    if (page && page !== 1) params.page = String(page);

    setSearchParams(params, { replace: true });
  }, [
    debouncedName,
    category,
    sort,
    priceOperator,
    debouncedPrice,
    page,
    setSearchParams,
  ]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handlePriceOperatorChange = (e) => {
    setPriceOperator(e.target.value);
    setPage(1);
  };

  const handlePriceValueChange = (e) => {
    setPriceValue(e.target.value);
    setPage(1);
  };

  const handlePrevPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setPage((p) => Math.min(searchMeta.numPages || 1, p + 1));
  };

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Search Products
        </motion.h1>

        <div className="bg-gray-800/60 rounded-lg p-4 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input
                value={name}
                onChange={handleNameChange}
                placeholder="Search by name..."
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c || "all"} value={c}>
                    {c ? c.charAt(0).toUpperCase() + c.slice(1) : "All"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Price</label>
              <div className="flex gap-2">
                <select
                  value={priceOperator}
                  onChange={handlePriceOperatorChange}
                  className="bg-gray-700 border border-gray-600 rounded-md px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {operators.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={priceValue}
                  onChange={handlePriceValueChange}
                  placeholder="250"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Sort</label>
              <select
                value={sort}
                onChange={handleSortChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 text-sm text-gray-300">
              <div>
                Showing {products.length} of {searchMeta.total}
              </div>
              <div>
                Page {searchMeta.page} / {searchMeta.numPages}
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {products?.length === 0 && (
                <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
                  No products found
                </h2>
              )}

              {products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>

            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={handlePrevPage}
                disabled={page <= 1}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &laquo; Prev
              </button>
              <button
                onClick={handleNextPage}
                disabled={page >= (searchMeta.numPages || 1)}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next &raquo;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
