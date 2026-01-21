// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const { verifyEmail, loading } = useUserStore();

  const [status, setStatus] = useState("loading");
  const sentRequest = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      const ok = await verifyEmail(token);
      setStatus(ok ? "success" : "error");
    };

    if (!sentRequest.current) {
      run();
    }

    return () => {
      sentRequest.current = true;
    };
  }, [token, verifyEmail]);

  const isLoading = status === "loading" || loading;

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Verify Email
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {isLoading && (
            <div className="flex flex-col items-center">
              <Loader className="h-10 w-10 animate-spin text-emerald-400" />
              <p className="mt-4 text-gray-300">Verifying your email...</p>
            </div>
          )}

          {!isLoading && status === "success" && (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-emerald-400" />
              <p className="mt-4 text-gray-200 font-medium">
                Your email has been verified.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Continue to login
              </Link>
            </div>
          )}

          {!isLoading && status === "error" && (
            <div className="flex flex-col items-center">
              <XCircle className="h-12 w-12 text-red-400" />
              <p className="mt-4 text-gray-200 font-medium">
                This verification link is invalid or has expired.
              </p>
              <p className="mt-2 text-sm text-gray-400">
                You can request a new verification email from the login page.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
              >
                Back to login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
