import { Navigate, Outlet } from "react-router";
import { useCheckAuthQuery } from "@/features/auth/authApiSlice";
import PageLoading from "../Loading/PageLoading";
import { Suspense } from "react";
import { ErrorBoundary } from "../ErrorComponents/ErrorBoundary";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const UnprotectedWrapper = () => {
  console.log("UNPROTECTED");

  const { isSuccess: isAuthSuccess, isLoading: isAuthLoading } =
    useCheckAuthQuery();

  if (isAuthLoading) {
    return <PageLoading />;
  }

  if (isAuthSuccess) {
    return <Navigate to="/app" replace />;
  } else {
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
};

export default UnprotectedWrapper;
