import { useEffect } from "react";
import { Button, Divider, Group, Menu, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { ChartPie, Gift, Logout } from "tabler-icons-react";
import { disconnectLocalWallet, useWallet } from "../../store/wallet";
import { claimDemoTokensForStaking, getAccountBalance, useContract } from "../../store/contract";

export default function WalletMenu() {
  const wallet = useWallet();
  const contract = useContract();

  const handleClaimDemoTokens = () => {
    claimDemoTokensForStaking();

    showNotification({
      title: `1 DOV has been successfully sent to ${wallet.connection.pairedAccount}`
    });
  }

  useEffect(() => {
    getAccountBalance();
  }, []);

  return (
    <Menu control={<Button>{wallet.connection.pairedAccount}</Button>} zIndex={1000}>
      <Group position="apart" px="sm" py="xs">
        <Text size="xs" weight={500}>Balance:</Text>
        <Text size="xs" weight={500}>{contract.accountBalance} DOV</Text>
      </Group>
      <Divider />
      <Menu.Item to="/stats" component={Link} icon={<ChartPie size={18} />}>
        Statistics
      </Menu.Item>
      <Menu.Item icon={<Gift size={18} />} onClick={handleClaimDemoTokens}>
        Claim Tokens
      </Menu.Item>
      <Divider />
      <Menu.Item icon={<Logout size={18} />} onClick={disconnectLocalWallet}>
        Disconnect
      </Menu.Item>
    </Menu>
  );
}