import AlertText from "@/components/ErrorComponents/AlertText";
import ButtonLoading from "@/components/Loading/ButtonLoading";
import { useLoginMutation } from "@/features/auth/authApiSlice";
import { LoginRequest } from "@/types/authTypes";
import { ValidationError } from "@/types/errorTypes";
import {
  extractValidationErrors,
  getApiErrorMessage,
} from "@/utils.ts/errorHandlers";
import { LockIcon, User2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [details, setDetails] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);

  const [validationErrors, setValidationErrors] = useState<
    ValidationError[] | []
  >([]);

  const usernameError: ValidationError | undefined = validationErrors.find(
    (error) => error.field === "username"
  );
  const passwordError: ValidationError | undefined = validationErrors.find(
    (error) => error.field === "password"
  );

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await login(details).unwrap();
      console.log(res);
      navigate("/app");
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  useEffect(() => {
    if (isError && error) {
      const extractedValidationErrors = extractValidationErrors(error);
      if (extractedValidationErrors) {
        setValidationErrors(extractedValidationErrors);
      }
      const errorMessage = getApiErrorMessage(error);
      console.log("EM: ", errorMessage);

      toast.error(errorMessage || "Error logging in");

      setApiError(errorMessage || "Error logging in");
    }
  }, [error, isError]);

  return (
    <main className="flex flex-col items-center justify-center gap-6 p-2">
      <form
        className=" bg-base-200 p-4 w-full max-w-xl rounded-lg"
        onSubmit={handleLogin}
      >
        <fieldset disabled={isLoading}>
          <h1 className="mb-6">Login</h1>
          <div className="mb-4">
            <label
              className={`input input-bordered flex items-center gap-2 ${
                usernameError && "input-error"
              }`}
              htmlFor="username"
            >
              <User2Icon className="icon" />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={details.username}
                // required
              />
            </label>
            {usernameError ? (
              <AlertText text={usernameError?.message} />
            ) : (
              <br />
            )}
          </div>
          <div className="mb-4">
            <label
              className={`input input-bordered flex items-center gap-2 ${
                passwordError && "input-error"
              }`}
              htmlFor="password"
            >
              <LockIcon className="icon" />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                name="password"
                required
                onChange={handleInputChange}
                value={details.password}
              />
            </label>
            {passwordError ? (
              <AlertText text={passwordError.message} />
            ) : (
              <br />
            )}
          </div>
          <button className="btn-secondary w-full text-2xl">
            {isLoading ? <ButtonLoading text="Logging in" /> : "Login"}
          </button>
        </fieldset>
        <br />
        {apiError ? <AlertText text={apiError} /> : <br />}
      </form>
      <p className="text-xl font-semibold">
        Do not have an account?{" "}
        <Link to="/register" className="link-text font-bold">
          Register
        </Link>
      </p>
    </main>
  );
};

export default LoginPage;
