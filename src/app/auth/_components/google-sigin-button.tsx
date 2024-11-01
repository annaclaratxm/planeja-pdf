import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export function GoogleSignInButton() {
  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "http://localhost:3000/client" });
  };

  return (
    <Button onClick={loginWithGoogle} className="w-full">
      <FaGoogle className="mr-2 h-4 w-4" />
      Entre com o Google
    </Button>
  );
}
