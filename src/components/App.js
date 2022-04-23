import { useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTheme } from "../store/theme";
import { useWallet } from "../store/wallet";
import Page from "../components/Page/Page";
import Home from "../pages/Home";
import Offsets from "../pages/Offsets";
import Staking from "../pages/Staking";

export default function App() {
  const theme = useTheme();
  const wallet = useWallet();

  useEffect(() => {
    wallet.init();
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <NotificationsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Page />}>
              <Route path="/" element={<Home />} />
              <Route path="/offsets" element={<Offsets />} />
              <Route path="/staking" element={<Staking />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  );
}