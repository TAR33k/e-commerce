// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Lock, Loader } from "lucide-react";
import useFormInput from "../hooks/useFormInput";
import { useUserStore } from "../stores/useUserStore";
import { useOrderStore } from "../stores/useOrderStore";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfilePage = () => {
  const { user, loading, changePassword } = useUserStore();
  const { orders, loading: ordersLoading, fetchMyOrders } = useOrderStore();

  const oldPassword = useFormInput("");
  const newPassword = useFormInput("");
  const confirmNewPassword = useFormInput("");

  const [showChangePassword, setShowChangePassword] = useState(false);

  const passwordStrength = useMemo(() => {
    const value = newPassword.value || "";
    const checks = {
      minLength: value.length >= 6,
      hasLower: /[a-z]/.test(value),
      hasUpper: /[A-Z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSymbol: /[^A-Za-z0-9]/.test(value),
    };

    const score = Object.values(checks).filter(Boolean).length;
    const label =
      score <= 1
        ? "Very weak"
        : score === 2
          ? "Weak"
          : score === 3
            ? "Fair"
            : score === 4
              ? "Good"
              : "Strong";

    const colorClass =
      score <= 1
        ? "bg-red-500"
        : score === 2
          ? "bg-orange-500"
          : score === 3
            ? "bg-yellow-500"
            : score === 4
              ? "bg-emerald-500"
              : "bg-emerald-400";

    const meetsMinimum = score >= 4;

    return { score, label, colorClass, meetsMinimum };
  }, [newPassword.value]);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword.value !== confirmNewPassword.value) {
      toast.error("Passwords do not match");
      return;
    }

    if (!passwordStrength.meetsMinimum) return;

    const ok = await changePassword(oldPassword.value, newPassword.value);
    if (ok) {
      oldPassword.reset();
      newPassword.reset();
      confirmNewPassword.reset();
      setShowChangePassword(false);
    }
  };

  if (loading || ordersLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Profile
        </motion.h1>

        <div className="flex justify-end max-w-5xl mx-auto m-8">
          <button
            className="max-w-5xl flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? "Cancel" : "Change password"}
          </button>
        </div>

        <div
          className={`grid grid-cols-1 gap-8 max-w-5xl mx-auto ${showChangePassword ? "md:grid-cols-2" : ""}`}
        >
          <motion.div
            className="bg-gray-800 shadow-lg rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
              Information
            </h2>

            <div className="space-y-3 text-gray-200">
              <div className="flex items-center">
                <span className="text-gray-300">Name:</span>
                <span className="ml-2 font-medium text-white">
                  {user?.name}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-300">Email:</span>
                <span className="ml-2 font-medium text-white">
                  {user?.email}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-300">Joined:</span>
                <span className="ml-2 font-medium text-white">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB")
                    : ""}
                </span>
              </div>
            </div>
          </motion.div>

          {showChangePassword && (
            <motion.div
              className="bg-gray-800 shadow-lg rounded-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
                Change password
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Current password
                  </label>
                  <input
                    type="password"
                    required
                    {...oldPassword.bind}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    New password
                  </label>
                  <input
                    type="password"
                    required
                    {...newPassword.bind}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {newPassword.value && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Password strength
                      </span>
                      <span className="text-xs text-gray-300">
                        {newPassword.value ? passwordStrength.label : ""}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded bg-gray-700">
                      <div
                        className={`h-2 rounded ${passwordStrength.colorClass}`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    required
                    {...confirmNewPassword.bind}
                    className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
                  disabled={loading || !passwordStrength.meetsMinimum}
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Update password
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </div>

        <motion.div
          className="bg-gray-800 shadow-lg rounded-lg p-8 mt-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
            Order history
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-400">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-gray-300">
                      <span className="text-gray-400">Order:</span> {order._id}
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="text-gray-400">Total:</span> $
                      {Number(order.totalAmount || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-GB")
                        : ""}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {order.products?.map((item, idx) => (
                      <div
                        key={`${order._id}-${idx}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-3">
                          {item.product?.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : null}
                          <div>
                            <div className="text-white">
                              {item.product?.name || "Product"}
                            </div>
                            <div className="text-gray-400">
                              Quantity: {item.quantity} - Price: $
                              {Number(item.price || 0).toFixed(2)} - Total: $
                              {(
                                Number(item.price || 0) * item.quantity
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
