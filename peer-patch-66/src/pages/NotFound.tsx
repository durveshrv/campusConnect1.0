
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="relative mb-8">
          <h1 className="text-9xl font-bold text-primary/10">404</h1>
          <h2 className="text-2xl font-bold absolute inset-0 flex items-center justify-center">Page Not Found</h2>
        </div>
        
        <p className="text-muted-foreground mb-8">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <Button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
