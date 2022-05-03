import { useEffect, useState } from "react";
import { Anchor, Button, Checkbox, Group, NumberInput, Paper, Select, Text } from "@mantine/core";
import { loadAccountBalance, stakeTokensToProject, unstakeTokensFromProject, useContract } from "../../store/contract";
import { showNotification } from "@mantine/notifications";

export default function ProjectStakeModal({ innerProps }) {
  const [amount, setAmount] = useState(0);
  const [term, setTerm] = useState("1");
  const contract = useContract();

  // TODO: implement
  async function handleStakeTokensToProject(project, amount) {
    const response = await stakeTokensToProject(project, amount); 
    console.log(response);
  }

  // TODO: implement
  async function handleUnstakeTokensFromProject(project, amount) {
    const response = await unstakeTokensFromProject(project, amount); 
    console.log(response);
  }

  useEffect(() => {
    // load account balance on initial render
    loadAccountBalance().catch(error => showNotification({
      title: "An error has occured loading account balance",
      message: error.message
    }));
  }, []);

  return (
    <>
      <Paper withBorder mt="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Total Users Staking</Text>
          <Text size="xs" weight={500}>100 USERS</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Total Staked Amount</Text>
          <Text size="xs" weight={500}>100,000 DOV</Text>
        </Group>
      </Paper>


      <Group mt="xl" spacing="xs">
        <NumberInput
          hideControls
          sx={{ flex: 1 }}
          description="Amount (DOV)"
          placeholder="DOV"
          value={amount}
          onChange={setAmount}
        />
        <Select
          description="Term (Years)"
          zIndex={1000}
          value={term}
          sx={{ maxWidth: 76 }}
          data={["1","2","3","4","5","6","7","8","9","10"]}
          onChange={setTerm}
        />
      </Group>

      <Text mt="sm" size="xs">Available Balance: {contract.accountBalance} DOV</Text>

      <Checkbox
        mt="xl"
        size="xs"
        label={(
          <Text size="xs">
            I agree to the <Anchor size="xs">User Agreenment</Anchor> and <Anchor size="xs">Privacy Policy</Anchor>
          </Text>
        )}
        
      />
      <Button mt="md" variant="light">Stake</Button>
    </>
  );
}