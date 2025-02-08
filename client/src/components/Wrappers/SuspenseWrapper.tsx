import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "../ErrorComponents/ErrorBoundary";
import PageLoading from "../Loading/PageLoading";

const SuspenseWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default SuspenseWrapper;
