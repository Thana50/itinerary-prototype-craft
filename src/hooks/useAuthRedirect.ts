
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoutes = {
        agent: '/agent-dashboard',
        traveler: '/traveler-dashboard',
        vendor: '/vendor-dashboard'
      };
      navigate(dashboardRoutes[user.role], { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
};
