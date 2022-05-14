import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import { useEffect, useState } from "react";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import contextModals from "./Modals";
import Page from "../components/Page/Page";
import Home from "../pages/Home";
import { useWallet } from "../services/wallet";

export default function App() {
  const [colorScheme, setColorScheme] = useState("light");
  const wallet = useWallet();

  function toggleColorScheme() {
    setColorScheme(colorScheme === "light" ? "dark" : "light");
  }

  useEffect(() => {
    wallet.initializeWallet.mutateAsync();
  }, []);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ fontFamily: "Inter, sans-serif", primaryColor: "indigo", colorScheme }}>
        <ModalsProvider modalProps={{ zIndex: 1000, centered: true, transition: "slide-right" }} modals={contextModals}>
          <NotificationsProvider position="top-center" zIndex={1000}>
            <BrowserRouter>
              <Routes>
                <Route element={<Page />}>
                  <Route path="/" element={<Home />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}