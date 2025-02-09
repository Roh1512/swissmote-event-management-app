import { Navigate, Outlet } from "react-router";
import { useCheckAuthQuery } from "@/features/auth/authApiSlice";
import PageLoading from "../Loading/PageLoading";
import { Suspense } from "react";
import { ErrorBoundary } from "../ErrorComponents/ErrorBoundary";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const UnprotectedWrapper = () => {
  console.log("UNPROTECTED");

  const {
    isError: isAuthError,
    isLoading: isAuthLoading,
    isSuccess: isAuthSuccess,
  } = useCheckAuthQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  if (isAuthLoading) {
    return <PageLoading />;
  }

  if (isAuthError) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Header />
          <Outlet />
          <Footer />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (isAuthSuccess) {
    return <Navigate to="/app" replace />;
  }

  return null;
};

export default UnprotectedWrapper;
