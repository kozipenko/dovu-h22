import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTheme } from "../store/theme";
import { initializeWallet } from "../services/wallet";
import contextModals from "./Modals";
import Page from "../components/Page/Page";
import Home from "../pages/Home";
import Stats from "../pages/Stats";

const queryClient = new QueryClient();

export default function App() {
  const theme = useTheme();

  useEffect(() => {
    initializeWallet();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <ModalsProvider modalProps={{ zIndex: 1000, centered: true, transition: "slide-right" }} modals={contextModals}>
          <NotificationsProvider position="top-center" zIndex={1000}>
            <BrowserRouter>
              <Routes>
                <Route element={<Page />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/stats" element={<Stats />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}