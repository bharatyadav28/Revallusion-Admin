import { useState, useEffect } from "react";
import { Eye, EyeClosed } from "lucide-react";
import toast from "react-hot-toast";

import { CustomInput } from "@/components/common/Inputs";
import { useSigninQueryMutation } from "@/store/apis/auth.apis";
import { showError } from "@/lib/reusable-funs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [signinQuery, { isLoading, error, isSuccess, data }] =
    useSigninQueryMutation();

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    signinQuery({ email, password });
  };

  console.log("Eroror", error);
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Show success message on signin
  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message);
      navigate("/", { replace: true });
    }
  }, [isSuccess]);

  return (
    <div className="flex h-max justify-center  mt-[10rem] lg:mx-0 mx-3">
      <div className="w-full max-w-md p-8 space-y-6 bg-[hsl(var(--border))] rounded-lg shadow-lg">
        <h2 className="text-2xl font-medium text-center text-white uppercase">
          Admin Signin
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 label"
            >
              Email Address
            </label>
            <CustomInput
              type="email"
              id="email"
              placeholder="Enter your email"
              text={email}
              setText={setEmail}
              className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--softpurple) focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>

            <div className="relative">
              <CustomInput
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                text={password}
                setText={setPassword}
                className="w-full px-4 py-2 mt-1 text-gray-900 bg-gray-200 rounded-lg focus:ring-2 focus:[var(--softpurple) focus:outline-none"
                required
              />
              <span className="px-1 absolute right-2 top-1/2 -translate-y-1/2 ">
                {!showPassword ? (
                  <Eye
                    onClick={() => setShowPassword((prev) => !prev)}
                    color="gray"
                    size={20}
                  />
                ) : (
                  <EyeClosed
                    onClick={() => setShowPassword((prev) => !prev)}
                    color="gray"
                    size={20}
                  />
                )}
              </span>
            </div>
          </div>

          <div></div>
          <button
            type="submit"
            className={`w-full px-4 py-2 font-semibold text-white bg-[var(--lightpurple)] rounded-lg hover:bg-[var(--softpurple) focus:outline-none uppercase ${
              isLoading ? "cursor-not-allowed" : "cursor-pointer"
            } 
            `}
          >
            <div className="flex items-center justify-center">
              {isLoading ? <LoadingSpinner size={22} /> : "LOGIN"}
            </div>
          </button>
        </form>
        <p className="text-sm text-center text-gray-400">
          Forgot your password?{" "}
          <a href="#" className="text-indigo-400 hover:underline">
            Reset it here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signin;
