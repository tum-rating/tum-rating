import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getPath, Paths } from "./paths.ts";

function ProtectedRoute({ children }: PropsWithChildren) {
  // const { user } = useUser();
  const user = true;
  const location = useLocation();
  if (!user)
    return (
      <Navigate to={getPath(Paths.login)} state={{ from: location }} replace />
    );
  return <>{children}</>;
}

export { ProtectedRoute };
