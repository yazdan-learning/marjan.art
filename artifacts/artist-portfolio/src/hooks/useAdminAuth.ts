import { useGetAdminMe } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export function useAdminAuth() {
  const { data, isLoading } = useGetAdminMe();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && data && !data.authenticated) {
      setLocation("/admin/login");
    }
  }, [data, isLoading, setLocation]);

  return { isAuthenticated: data?.authenticated ?? false, isLoading };
}
