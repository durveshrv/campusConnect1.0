
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-transparent -z-10" />
      
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 -left-20 w-60 h-60 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-primary/5 animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-12 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-block rounded-full px-3 py-1 text-sm bg-accent text-accent-foreground font-medium mb-4">
              Connecting Campus Life
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              Your Complete Campus Connection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find rides, form study groups, buy and sell items, discover roommates, and stay connected with your campus community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              size="lg" 
              onClick={onGetStarted} 
              className="rounded-full px-8 group"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
