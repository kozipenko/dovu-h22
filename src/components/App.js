import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import contextModals from "./Modals";
import Page from "../components/Page/Page";
import Home from "../pages/Home";
import Stats from "../pages/Stats";

const queryClient = new QueryClient();

export default function App() {
  const [colorScheme, setColorScheme] = useState("light");

  function toggleColorScheme() {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme, primaryColor: "indigo" }}>
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
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}