import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const baseUrl = "https://campusconnect-1.onrender.com";
    const endpoint = isLogin ? "/users/login" : "/users"; // Adjusted endpoint based on typical REST API conventions
    
    const payload = isLogin 
      ? { email, password }
      : { name, phoneno, email, username, password, gender };

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const token = await response.text(); // Since the response is directly the token

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(isLogin ? "Invalid Email Or Password" : "Registration Failed");
      }
      throw new Error("Something went wrong");
    }

    // Store token and redirect on successful login
    if (isLogin) {
      localStorage.setItem("token", token);
      toast.success("Successfully logged in!");
      navigate("/"); // Redirect to home page
    } else {
      toast.success("Account created successfully! Please login.");
      setIsLogin(true); // Switch to login mode after successful registration
    }

    // Reset form
    setEmail("");
    setPassword("");
    setName("");
    setPhoneno("");
    setUsername("");
    setGender("");
    if (isLogin) onClose();

  } catch (error) {
    toast.error(error.message || "Failed to process request");
  } finally {
    setIsLoading(false);
  }
};

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setName("");
    setPhoneno("");
    setUsername("");
    setGender("");
  };

  // Redirect if already logged in
  if (localStorage.getItem("token") && isOpen) {
    navigate("/");
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isLogin ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Sign in to your account to continue" 
              : "Fill in the information below to get started"
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneno">Phone Number</Label>
                <Input 
                  id="phoneno" 
                  value={phoneno}
                  onChange={(e) => setPhoneno(e.target.value)}
                  placeholder="Enter your phone number"
                  required={!isLogin}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required={!isLogin}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input 
                  id="gender" 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="Enter your gender"
                  required={!isLogin}
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              required
            />
          </div>
          
          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading 
              ? "Processing..." 
              : isLogin ? "Sign In" : "Create Account"
            }
          </Button>
        </form>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-0 border-t pt-4">
          <Button variant="link" type="button" onClick={toggleMode} className="sm:order-1">
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};