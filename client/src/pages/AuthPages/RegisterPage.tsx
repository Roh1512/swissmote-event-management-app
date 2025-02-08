import AlertText from "@/components/ErrorComponents/AlertText";
import ButtonLoading from "@/components/Loading/ButtonLoading";
import { useRegisterMutation } from "@/features/auth/authApiSlice";
import { RegisterRequest } from "@/types/authTypes";
import { ValidationError } from "@/types/errorTypes";
import {
  extractValidationErrors,
  getApiErrorMessage,
} from "@/utils.ts/errorHandlers";
import { LockIcon, MailIcon, User2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [details, setDetails] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState<
    ValidationError[] | []
  >([]);
  const usernameError: ValidationError | undefined = validationErrors.find(
    (error) => error.field === "username"
  );
  const emailError: ValidationError | undefined = validationErrors.find(
    (error) => error.field === "email"
  );
  const passwordError: ValidationError | undefined = validationErrors.find(
    (error) => error.field === "password"
  );
  const [register, { isLoading, isError, error }] = useRegisterMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await register(details).unwrap();
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

      toast.error(errorMessage || "Error Registering user");

      setApiError(errorMessage || "Error Registering user");
    }
  }, [error, isError]);

  return (
    <main className="flex flex-col items-center justify-center gap-6 p-2">
      <form
        className=" bg-base-200 p-4 w-full max-w-xl rounded-lg"
        onSubmit={handleRegister}
      >
        <fieldset disabled={isLoading}>
          <h1 className="mb-6">Register </h1>
          <div className="mb-4">
            <label
              className="input input-bordered flex items-center gap-2"
              htmlFor="username"
            >
              <User2Icon className="icon" />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                value={details.username}
                onChange={handleInputChange}
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
              className="input input-bordered flex items-center gap-2"
              htmlFor="email"
            >
              <MailIcon className="icon" />
              <input
                type="text"
                className="grow"
                placeholder="Email"
                name="email"
                value={details.email}
                onChange={handleInputChange}
              />
            </label>
            {emailError ? <AlertText text={emailError.message} /> : <br />}
          </div>
          <div className="mb-4">
            <label
              className="input input-bordered flex items-center gap-2"
              htmlFor="password"
            >
              <LockIcon className="icon" />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                name="password"
                required
                value={details.password}
                onChange={handleInputChange}
              />
            </label>
            {passwordError ? (
              <AlertText text={passwordError.message} />
            ) : (
              <br />
            )}
          </div>
          <button className="btn-neutral w-full text-2xl">
            {isLoading ? <ButtonLoading text="Registering" /> : "Register"}
          </button>
          <br />
        </fieldset>
        <br />
        {apiError ? <AlertText text={apiError} /> : <br />}
      </form>
      <p className="text-xl font-semibold">
        Have an account?{" "}
        <Link to="/login" className="link-text font-bold">
          Login
        </Link>
      </p>
    </main>
  );
};

export default RegisterPage;
