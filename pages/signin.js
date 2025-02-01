import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Button from "../components/ui/Button"; // Custom Button component
import Input from "../components/ui/Input"; // Custom Input component

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setErrorMessage(res.error);
    } else {
      // Redirect to PollingApp after successful login
      router.push("/pollingapp");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="flex flex-col items-center bg-black p-6 rounded-lg w-full max-w-lg">
        <form onSubmit={handleSubmit} className="w-full">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button type="submit">Sign In</Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
