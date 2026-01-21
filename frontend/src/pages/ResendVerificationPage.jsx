// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Mail, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useFormInput from "../hooks/useFormInput";
import { useUserStore } from "../stores/useUserStore";

const ResendVerificationPage = () => {
  const {
    pendingEmail,
    resendEmailVerification,
    loading,
    clearEmailVerificationState,
  } = useUserStore();

  const email = useFormInput(pendingEmail || "");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await resendEmailVerification(email.value);
    if (ok) {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Resend verification email
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <p className="text-sm text-gray-300 mb-6">
            We sent you a verification email.
            <br />
            <br />
            If you did not receive it or it expired, enter your email and we'll
            send you a new verification link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  {...email.bind}
                  className=" block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
								rounded-md shadow-sm
								 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
								 focus:border-emerald-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Sending...
                </>
              ) : (
                "Resend verification email"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <Link
              to="/login"
              onClick={clearEmailVerificationState}
              className="font-medium text-emerald-400 hover:text-emerald-300"
            >
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResendVerificationPage;
