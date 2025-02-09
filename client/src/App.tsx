import { lazy } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UnprotectedWrapper from "./components/Wrappers/UnprotectedWrapper";
import ProtectedRoutes from "./components/Wrappers/ProtectedRoutes";
import NotFound from "./components/ErrorComponents/NotFound";
import { useTheme } from "./context/ThemeContext";

const HomePage = lazy(() => import("@pages/Home/HomePage"));
const LoginPage = lazy(() => import("@pages/AuthPages/LoginPage"));
const RegisterPage = lazy(() => import("@pages/AuthPages/RegisterPage"));
const Categories = lazy(() => import("@pages/CategoryPages/Categories"));
const EventsPage = lazy(() => import("@pages/EventPages/EventsPage"));
const MyEvents = lazy(() => import("@pages/ProfilePages/MyEvents"));
const Profile = lazy(() => import("@pages/ProfilePages/Profile"));

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<UnprotectedWrapper />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoutes />} errorElement={<p>Error</p>}>
        <Route path="/app" element={<EventsPage />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  )
);

function App() {
  const { theme } = useTheme();
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={theme === "luxury" ? "dark" : "light"}
      />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
