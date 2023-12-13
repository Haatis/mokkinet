import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [registered, setRegistered] = useState(true);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  if (user) {
    navigate("/");
  }

  return (
    <div className="flex flex-col min-h-screen bg-tiara mt-16">
      {registered ? (
        <LoginForm setRegistered={setRegistered} />
      ) : (
        <RegisterForm setRegistered={setRegistered} />
      )}
    </div>
  );
}
