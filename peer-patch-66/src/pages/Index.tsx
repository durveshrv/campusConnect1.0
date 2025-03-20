
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, BookOpen, ShoppingCart, Users, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureCard } from "@/components/FeatureCard";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      title: "Bike Buddy",
      description: "Connect with students who own bikes or need rides around campus.",
      icon: Bike,
      color: "bg-blue-50",
      path: "/bike-buddy"
    },
    {
      title: "Study Groups",
      description: "Create and join study groups to collaborate with classmates.",
      icon: BookOpen,
      color: "bg-green-50",
      path: "/study-groups"
    },
    {
      title: "Marketplace",
      description: "Buy and sell textbooks, furniture, and other items within the campus community.",
      icon: ShoppingCart,
      color: "bg-amber-50",
      path: "/marketplace"
    },
    {
      title: "Roommate Finder",
      description: "Find compatible roommates based on lifestyle preferences and housing needs.",
      icon: Users,
      color: "bg-purple-50",
      path: "/roommate-finder"
    },
    {
      title: "Campus Forum",
      description: "Stay updated with campus events and participate in community discussions.",
      icon: MessageSquare,
      color: "bg-red-50",
      path: "/forum"
    }
  ];

  const handleFeatureClick = (path: string) => {
    setIsAuthModalOpen(true);
    // We would navigate after authentication in a real app
    // navigate(path);
  };

  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
      
      <Hero onGetStarted={() => setIsAuthModalOpen(true)} />
      
      {/* Features Section */}
      <section className="py-16 px-4 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Campus Connect provides all the tools you need to navigate and enhance your campus experience.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
                onClick={() => handleFeatureClick(feature.path)}
                delay={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-accent/30 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with Campus Connect in just a few simple steps.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create an account",
                description: "Sign up using your school email to verify your student status."
              },
              {
                step: "02",
                title: "Complete your profile",
                description: "Add your interests, schedule, and preferences to get personalized recommendations."
              },
              {
                step: "03",
                title: "Start connecting",
                description: "Browse and join groups, list items, or find roommates that match your needs."
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-sm"
              >
                <div className="text-5xl font-bold text-primary/10 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 text-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container mx-auto max-w-3xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Connect?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of students who are already enhancing their campus experience with Campus Connect.
          </p>
          <Button 
            size="lg" 
            onClick={() => setIsAuthModalOpen(true)} 
            className="rounded-full px-8"
          >
            Get Started Now
          </Button>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="bg-accent/30 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold">
                Campus<span className="text-primary font-bold">Connect</span>
              </h3>
              <p className="text-muted-foreground mt-2">Enhancing student life, one connection at a time.</p>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-accent-foreground/10 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Campus Connect. All rights reserved.
          </div>
        </div>
      </footer>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Index;
