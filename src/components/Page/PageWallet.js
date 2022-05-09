import { Button, Divider, Menu } from "@mantine/core";
import { Link } from "react-router-dom";
import { ChartPie, Edit, Gift, Logout, Settings, Wallet } from "tabler-icons-react";
import { useModals } from "@mantine/modals";
import { disconnectLocalWallet, useWallet } from "../../services/wallet";
import { CONTRACT_ID } from "../../services/contract";

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
        pairedAccount: wallet.accountId
      }
    });
  }

  return wallet.accountId ? (
    <Menu
      zIndex={1000}
      control={
        <Button leftIcon={<Wallet size={18} />}>
          {wallet.accountId}
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

      {wallet.isContractOwner && (
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
      <Menu.Item icon={<Logout size={18} />} onClick={disconnectLocalWallet}>
        Disconnect
      </Menu.Item>
    </Menu>
  ) : (
    <Button leftIcon={<Wallet size={18} />} onClick={handleOpenWalletConnectModal}>
      Connect
    </Button>
  );
}

/*
// Add back to menu or find somewhere else for account balance?
function handleLoadAccountBalance() {
  loadAccountBalance().catch(error => showNotification({
    title: "An erorr has occured loading account balance",
    message: error.message
  }));
}
<Group position="apart" px="sm" py="xs">
  <Text size="xs" weight={500}>Balance:</Text>
  <Text size="xs" weight={500}>{contract.accountBalance} {TOKEN_NAME}</Text>
</Group>
*/