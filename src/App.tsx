
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/layout/sidebar-provider";
import DashboardLayout from "@/components/layout/dashboard-layout";
import RequireAuth from "@/components/layout/RequireAuth";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import Finance from "./pages/Finance";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<RequireAuth />}>
              <Route element={
                <SidebarProvider>
                  <DashboardLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Index />} />
                      <Route path="/documents" element={<Documents />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </DashboardLayout>
                </SidebarProvider>
              }>
                <Route path="/dashboard" element={<Index />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/calendar" element={<Calendar />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
