import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import {
  AboutPage,
  ContactPage,
  DeveloperDetailPage,
  DevelopersPage,
  FaqPage,
  GuidesPage,
  HomePage,
  LocationDetailPage,
  LocationsPage,
  NotFoundPage,
  PrivacyPage,
  PropertiesPage,
  PropertyDetailPage,
  ServicesPage,
  TermsPage,
} from "./pages/RealEstatePages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:slug" element={<PropertyDetailPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/locations/:slug" element={<LocationDetailPage />} />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/developers/:id" element={<DeveloperDetailPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/work" element={<Navigate to="/properties" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
