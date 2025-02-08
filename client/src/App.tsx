import { lazy } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PageLoading from "./components/Loading/PageLoading";
import UnprotectedWrapper from "./components/Wrappers/UnprotectedWrapper";
import ProtectedRoutes from "./components/Wrappers/ProtectedRoutes";
import NotFound from "./components/ErrorComponents/NotFound";
import LogoutButton from "./components/Logout/LogoutButton";

const HomePage = lazy(() => import("@pages/Home/HomePage"));
const LoginPage = lazy(() => import("@pages/AuthPages/LoginPage"));
const RegisterPage = lazy(() => import("@pages/AuthPages/RegisterPage"));
const Categories = lazy(() => import("@pages/CategoryPages/Categories"));

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<UnprotectedWrapper />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route
          path="/app"
          element={
            <>
              <h1>App</h1>
              <LogoutButton />
            </>
          }
        />
        <Route path="/category" element={<Categories />} />
      </Route>

      <Route path="/loading" element={<PageLoading />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
