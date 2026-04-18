import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CookieConsent } from "@/components/CookieConsent";
import { TrackingScripts } from "@/components/tracking/TrackingScripts";
import { TrackingProvider } from "@/components/tracking/TrackingProvider";
import { ScrollDepthTracker } from "@/components/tracking/ScrollDepthTracker";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

import HomePage from "@/pages/HomePage";
import ServicesIndex from "@/pages/ServicesIndex";
import ServiceDetail from "@/pages/ServiceDetail";
import ProjectsPage from "@/pages/ProjectsPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import QuotePage from "@/pages/QuotePage";
import ThankYouPage from "@/pages/ThankYouPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminLeadsPage from "@/pages/AdminLeadsPage";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";

function Layout() {
  return (
    <TrackingProvider>
      <JsonLd data={localBusinessSchema} />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicos" element={<ServicesIndex />} />
            <Route path="/servicos/:slug" element={<ServiceDetail />} />
            <Route path="/projetos" element={<ProjectsPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/orcamento" element={<QuotePage />} />
            <Route path="/obrigado" element={<ThankYouPage />} />
            <Route path="/politica-privacidade" element={<PrivacyPage />} />
            <Route path="/termos" element={<TermsPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/leads" element={<AdminLeadsPage />} />
            <Route path="/admin/configuracoes" element={<AdminSettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <WhatsAppFloat />
      <CookieConsent />
      <TrackingScripts />
      <ScrollDepthTracker />
    </TrackingProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
