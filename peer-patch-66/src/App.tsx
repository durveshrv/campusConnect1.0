
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BikeBuddy from "./pages/BikeBuddy";
import StudyGroups from "./pages/StudyGroups";
import Marketplace from "./pages/Marketplace";
import RoommateFinder from "./pages/RoommateFinder";
import Forum from "./pages/Forum";
import NotFound from "./pages/NotFound";
import PostDetail from "./components/PostDetail";
import PostReply from "./components/PostReply";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bike-buddy" element={<BikeBuddy />} />
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/roommate-finder" element={<RoommateFinder />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/post/:id" element={<PostDetail/>} />
        <Route path="/post/:id/reply" element={<PostReply />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
