import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../assets/styles/global.css";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient.ts";
import PwaPullToRefresh from "@/components/common/PwaPullToRefresh";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PwaPullToRefresh />
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </StrictMode>,
);
