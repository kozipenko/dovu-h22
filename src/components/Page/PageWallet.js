import { Button, Divider, Menu } from "@mantine/core";
import { Link } from "react-router-dom";
import { ChartPie, Edit, Gift, Logout, Settings, UserCircle } from "tabler-icons-react";
import { useModals } from "@mantine/modals";
import { CONTRACT_ID } from "../../utils/constants";
import { showErrorNotification, showSuccessNotification } from "../../utils/notifications";
import { useWallet } from "../../services/wallet";

export default function PageWallet() {
  const modals = useModals();
  const wallet = useWallet();

  function handleOpenWalletConnectModal() {
    modals.openContextModal("walletConnect", {
      title: "Connect Hedera Wallet"
    });
  }

  function handleOpenOwnerProjectsModal() {
    modals.openContextModal("ownerProjects", {
      title: "Projects"
    });
  }

  function handleOpenOwnerSettingSModal() {
    modals.openContextModal("ownerSettings", {
      title: "Contract Settings: " + CONTRACT_ID
    });
  }

  function handleClaimDemoTokensForStaking() {
    modals.openContextModal("claimTokens", {
      title: "Claim Tokens",
      innerProps: {
        pairedAccount: wallet.local.accountId
      }
    });
  }

  async function handleDisconnectWallet() {
    try {
      await wallet.disconnectWallet.mutateAsync();
      showSuccessNotification("Success", `${wallet.local.accountId} has been disconnected`);
    } catch {
      showErrorNotification("Error", "There was a problem disconnecting from wallet");
    }
  }

  return wallet.local.accountId ? (
    <Menu
      zIndex={1000}
      control={
        <Button variant="light" leftIcon={<UserCircle size={18} />}>
          {wallet.local.accountId}
        </Button>
      }
    >
      <Menu.Label>User</Menu.Label>
      <Menu.Item to="/stats" component={Link} icon={<ChartPie size={18} />}>
        Stats
      </Menu.Item>
      <Menu.Item icon={<Gift size={18} />} onClick={handleClaimDemoTokensForStaking}>
        Claim Tokens
      </Menu.Item>

      {wallet.local.isContractOwner && (
        <>
          <Divider />
          <Menu.Label>Owner</Menu.Label>
          <Menu.Item icon={<Edit size={18} />} onClick={handleOpenOwnerProjectsModal}>
            Projects
          </Menu.Item>
          <Menu.Item icon={<Settings size={18} />} onClick={handleOpenOwnerSettingSModal}>
            Settings
          </Menu.Item>
        </>
      )}

      <Divider />
      <Menu.Item icon={<Logout size={18} />} onClick={handleDisconnectWallet}>
        Disconnect
      </Menu.Item>
    </Menu>
  ) : (
    <Button onClick={handleOpenWalletConnectModal}>
      Connect
    </Button>
  );
}