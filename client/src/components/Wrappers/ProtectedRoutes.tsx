import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useCheckAuthQuery } from "@/features/auth/authApiSlice";
import PageLoading from "../Loading/PageLoading";
import { ErrorBoundary } from "../ErrorComponents/ErrorBoundary";
import { Suspense } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const ProtectedRoutes = () => {
  console.log("PROTECTED");

  const location = useLocation();
  const { isError: isAuthError, isLoading: isAuthLoading } = useCheckAuthQuery(
    undefined,
    {
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }
  );
  if (isAuthLoading) {
    return <PageLoading />;
  }
  if (isAuthError) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProtectedRoutes;
