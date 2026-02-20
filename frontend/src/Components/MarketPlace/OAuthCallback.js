import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userId = params.get("userId");

    if (token) {
      localStorage.setItem("token", token);
    }
    if (userId) {
      localStorage.setItem("userId", userId);
    }

    navigate("/web_home", { replace: true });
  }, [location.search, navigate]);

  return null;
}

export default OAuthCallback;
