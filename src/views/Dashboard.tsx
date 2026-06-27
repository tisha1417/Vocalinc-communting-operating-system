import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Operations from "@/pages/Operations";
import AuraSafetyEngine from "@/pages/AuraSafetyEngine";
import Analytics from "@/pages/Analytics";

import EventHub from "@/pages/EventHub";
import NotFound from "@/pages/NotFound";
import Complaints from "@/pages/Complaints";
import { TechnicianHub } from "@/components/TechnicianHub";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/operations" element={<Operations />} />
              <Route
                path="/aura-safety-engine"
                element={<AuraSafetyEngine />}
              />
              <Route path="/event-hub" element={<EventHub />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/technicians" element={<TechnicianHub />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
