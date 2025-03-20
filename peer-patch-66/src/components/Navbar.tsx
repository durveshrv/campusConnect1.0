import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import http from "../services/httpService.js"; // Your custom http service
import { jwtDecode } from "jwt-decode";

// Extend JwtPayload to include custom _id field
interface CustomJwtPayload {
  _id: string; // Add your custom field here
}

// Define api directly
export const api = {
  tagsEndPoint: "https://campusconnect-1.onrender.com/tags/",
  usersEndPoint: "https://campusconnect-1.onrender.com/users/",
  postsEndPoint: "https://campusconnect-1.onrender.com/posts/",
  repliesEndPoint: "https://campusconnect-1.onrender.com/reply/",
};

export const Navbar = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Exit if no token

      try {
        const user_jwt = jwtDecode<CustomJwtPayload>(token); // Use custom type
        const response = await http.get(`${api.usersEndPoint}${user_jwt._id}`);
        setUser(response.data);
      } catch (ex) {
        console.error("Error fetching user:", ex);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/"); // Redirect to home
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Bike Buddy", path: "/bike-buddy" },
    { name: "Study Groups", path: "/study-groups" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Roommate Finder", path: "/roommate-finder" },
    { name: "Campus Forum", path: "/forum" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-out py-4 px-4 md:px-8",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-semibold tracking-tight animate-fade-in">
            Campus<span className="text-primary font-bold">Connect</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "nav-item",
                location.pathname === link.path && "nav-item-active"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {/* Desktop: Conditional rendering */}
          {!user ? (
            <Button
              onClick={onLoginClick}
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </Button>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-foreground">Hi {user.username}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-40 pt-20 animate-fade-in">
          <div className="flex flex-col items-center justify-start p-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-lg py-3 px-6 rounded-lg w-full text-center",
                  location.pathname === link.path
                    ? "bg-accent text-foreground font-medium"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-colors"
                )}
              >
                {link.name}
              </Link>
            ))}
            {!user ? (
              <Button
                onClick={() => {
                  onLoginClick();
                  setIsMenuOpen(false);
                }}
                className="w-full mt-4 flex items-center justify-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            ) : (
              <div className="w-full mt-4 flex flex-col gap-4">
                <span className="text-lg text-center text-foreground">
                  Hi {user.username}
                </span>
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
