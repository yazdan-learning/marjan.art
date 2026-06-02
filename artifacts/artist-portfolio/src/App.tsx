import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/queryClient";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Collections from "@/pages/Collections";
import PaintingDetail from "@/pages/PaintingDetail";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminPaintings from "@/pages/admin/AdminPaintings";
import AdminPaintingForm from "@/pages/admin/AdminPaintingForm";
import AdminSeries from "@/pages/admin/AdminSeries";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/collections" component={Collections} />
        <Route path="/paintings/:id" component={PaintingDetail} />
        <Route path="/contact" component={Contact} />
        
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/paintings/new" component={AdminPaintingForm} />
        <Route path="/admin/paintings/:id/edit" component={AdminPaintingForm} />
        <Route path="/admin/paintings" component={AdminPaintings} />
        <Route path="/admin/series" component={AdminSeries} />
        <Route path="/admin">
          {() => { window.location.replace("/admin/paintings"); return null; }}
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
