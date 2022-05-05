import { useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useTheme } from "../store/theme";
import { initializeHashConnect } from "../store/wallet";
import {
  ProjectPurchaseModal,
  ProjectStakeModal,
  ProjectStakeConfirmModal,
  WalletConnectModal,
  ClaimTokensModal,
  OwnerSettingsModal,
  OwnerEditProjectModal,
  OwnerNewProjectModal,
} from "./Modals";
import Page from "../components/Page/Page";
import Home from "../pages/Home";
import Stats from "../pages/Stats";

export default function App() {
  const theme = useTheme();

  useEffect(() => {
    initializeHashConnect();
  }, []);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <ModalsProvider
        modalProps={{ zIndex: 1000, centered: true, transition: "slide-right" }}
        modals={{
          projectPurchase: ProjectPurchaseModal,
          projectStake: ProjectStakeModal,
          projectStakeConfirm: ProjectStakeConfirmModal,
          walletConnect: WalletConnectModal,
          claimTokens: ClaimTokensModal,
          ownerSettings: OwnerSettingsModal,
          ownerEditProject: OwnerEditProjectModal,
          ownerNewProject: OwnerNewProjectModal
        }}
      >
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
  );
}