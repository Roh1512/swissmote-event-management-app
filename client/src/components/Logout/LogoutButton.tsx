import { useLogoutMutation } from "@/features/auth/authApiSlice";
import ButtonLoading from "../Loading/ButtonLoading";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
  return (
    <button className="btn btn-warning" onClick={handleLogout}>
      {isLoading ? <ButtonLoading text="Waiing" /> : "Logout"}
    </button>
  );
};

export default LogoutButton;
