import { useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTheme } from "../store/theme";
import { useWallet } from "../store/wallet";
import Page from "../components/Page/Page";
import Home from "../pages/Home";
import Stats from "../pages/Stats";

export default function App() {
  const theme = useTheme();
  const wallet = useWallet();

  useEffect(() => {
    wallet.init();
  }, [wallet]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <NotificationsProvider position="top-center" zIndex={1001}>
        <BrowserRouter>
          <Routes>
            <Route element={<Page />}>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  );
}