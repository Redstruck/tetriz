import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameSettingsProvider } from "@/contexts/GameSettingsContext";
import Index from "./pages/Index";
import GamePage from "./pages/GamePage";
import ExtraGamePage from "./pages/ExtraGamePage";
import SpeedrunGamePage from "./pages/SpeedrunGamePage";
import VersusGamePage from "./pages/VersusGamePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <GameSettingsProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/game/extra" element={<ExtraGamePage />} />
            <Route path="/game/speedrun" element={<SpeedrunGamePage />} />
            <Route path="/game/versus" element={<VersusGamePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GameSettingsProvider>
);

export default App;
