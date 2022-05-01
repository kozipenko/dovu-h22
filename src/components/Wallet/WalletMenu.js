import { useEffect } from "react";
import { Button, Divider, Group, Menu, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { ChartPie, Gift, Logout, Wallet } from "tabler-icons-react";
import { disconnectLocalWallet, useWallet } from "../../store/wallet";
import { claimDemoTokensForStaking, getAccountBalance, useContract, changeStateOfTestContract, addProjectForStaking, addTokensToTreasury } from "../../store/contract";

export default function WalletMenu() {
  const wallet = useWallet();
  const contract = useContract();

  const handleChangeStateOfTestContract = () => {
    changeStateOfTestContract(100);

    showNotification({
      title: `Changed state of contract.`
    });
  }

  const handleClaimDemoTokens = () => {
    claimDemoTokensForStaking(10);

    showNotification({
      title: `10 DOV has been successfully sent to ${wallet.connection.pairedAccount}`
    });
  }

  const handleAddProject = () => {
    const account_id = '0.0.1' + Math.floor(Math.random() * 100000)
    console.log("Trying to add project: ", account_id)
    addProjectForStaking(account_id);

    showNotification({
      title: `Added new project.`
    });
  }

  const handleAddTokenstoTreasury = () => {
    console.log("Adding tokens to treasury...");
    addTokensToTreasury(1000000);
    showNotification({
      title: `Adding tokens to treasury.`
    });
  }

  useEffect(() => {
    getAccountBalance();
  }, []);

  return (
    <Menu
      zIndex={1000}
      control={
        <Button leftIcon={<Wallet size={18} />}>
          {wallet.connection.pairedAccount}
        </Button>
      }
    >
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