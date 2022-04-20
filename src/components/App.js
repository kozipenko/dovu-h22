import { useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTheme } from "../store/theme";
import { useWallet } from "../store/wallet";
import Layout from "./Layout";
import HomeRoute from "../routes/HomeRoute";
import OffsetsRoute from "../routes/OffsetsRoute";
import StakingRoute from "../routes/StakingRoute";

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
            <Route element={<Layout />}>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/offsets" element={<OffsetsRoute />} />
              <Route path="/staking" element={<StakingRoute />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </MantineProvider>
  );
}