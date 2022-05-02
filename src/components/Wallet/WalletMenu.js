import { useEffect } from "react";
import { Button, Divider, Group, Menu, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { ChartPie, Gift, Logout, Wallet } from "tabler-icons-react";
import { disconnectLocalWallet, useWallet } from "../../store/wallet";
import { claimDemoTokensForStaking, getAccountBalance, useContract, addProjectForStaking, addTokensToTreasury, stakeTokensToProject, unstakeTokensFromProject } from "../../store/contract";


export default function WalletMenu() {
  const wallet = useWallet();
  const contract = useContract()

  async function handleClaimDemoTokens() {
    const response = await claimDemoTokensForStaking(10000);
    if (response) {
      showNotification({
        title: `10 DOV has been successfully sent to ${wallet.connection.pairedAccount}`
      });
    }else{
      showNotification({
        title: `Could not claim demo tokens for: ${wallet.connection.pairedAccount}`
      });
    }
  }

  /*
   * ADMIN ONLY.
   * accountId: the id of the hedera entity/project (this could be HTS id, Account id, or DID)
   * verifiedCarbonKg: the amount of kgs to add to a project
   */
  async function handleAddProject(accountId, verifiedCarbonKg) {
    const response = await addProjectForStaking(accountId, verifiedCarbonKg);
    if (response) {
      showNotification({
        title: `Added new project: ${accountId} associated with ${verifiedCarbonKg} kg's of verified carbon.`
     });
    }else{
      showNotification({
        title: `Could not add project: ${accountId}.`
     });
    }
  }
  // ADMIN ONLY.
  // export TOKEN_ID from contract.js so we can include it in notification?
  async function handleAddTokenstoTreasury(amount) {
    const response = await addTokensToTreasury(amount);
    if (response) {
      showNotification({
        title: `Added ${amount} tokens to treasury.`
      });
    }else{
      showNotification({
        title: `Unable to add tokens to treasury.`
     });
    }
  }

  /*
   * project: the id of the entity that reputation energy (tokens) staked on it
   * amount: the amount of tokens to remove (will revert if the balance of the user is too low)
   */
  async function handleStakeTokensToProject(project, amount) {
    const response = await stakeTokensToProject(project, amount); 
    if (response) {
      showNotification({
        title: `Congratulations, you've staked ${amount}!`
      });
    }else{
      showNotification({
        title: `Unable to stake to project!` // can we get a human readable version of the project?
      });
    }
  }

    /*
   * project: the id of the entity that reputation energy (tokens) staked on it
   * amount: the amount of tokens to remove (could be too much)
   */
  async function handleUnstakeTokensFromProject(project, amount) {
    const response = await unstakeTokensFromProject(project, amount); 
    if (response) {
      showNotification({
        title: `You've unstaked ${amount}.` // from $PROJECT
      });
    }else{
      showNotification({
        title: `Unable to unstake funds from project, please try again later...` // can we get a human readable version of the project?
      });
    }
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