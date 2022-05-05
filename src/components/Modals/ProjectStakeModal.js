import { useEffect, useState } from "react";
import { Anchor, Button, Checkbox, Group, NumberInput, Paper, Select, Text } from "@mantine/core";
import { getStakedPosition, loadAccountBalance, stakeTokensToProject, TOKEN_EXP, TOKEN_NAME, unstakeTokensFromProject, useContract, getNumberOfTokensStakedToProject } from "../../store/contract";
import { showNotification } from "@mantine/notifications";
import { connectToLocalWallet } from "../../store/wallet";
// TODO: Needs a lot of work...
export default function ProjectStakeModal({ context, id, innerProps }) {
  const [amount, setAmount] = useState(0);
  const [term, setTerm] = useState("1");
  const contract = useContract();
  const [stateTempValues, setStateTempValues] = useState({});

  const stakeAmountString = "Amount: (" + TOKEN_NAME + ")";

  // TODO: project == innerProps.project.id, amount = userInput.
  async function handleStakeTokensToProject() {
    const response = await stakeTokensToProject(innerProps.project.id, amount); 
    console.log("resp" + response);
  }

  // TODO: implement
  async function handleUnstakeTokensFromProject(project, amount) {
    const response = await unstakeTokensFromProject(project, amount); 
    console.log(response);
  }

  async function getProjectUserData() {
    return await getStakedPosition(innerProps.project.id);
  }

  async function getTotalStakedToProject() {
    const totalStaked = await getNumberOfTokensStakedToProject(innerProps.project.id);
    innerProps.project.totalStaked = totalStaked;
  }

  useEffect(() => {
    // load account balance on initial render
    loadAccountBalance().catch(error => showNotification({
      title: "An error has occured loading account balance",
      message: error.message
    }));
   
    getTotalStakedToProject();
    getProjectUserData().then(rsp => {
      setStateTempValues(rsp);
    });
    
  }, []);
  // TODO: Add real data to this.
  return (
    <>
      <Paper withBorder mt="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">APY:</Text>
          <Text size="xs" weight={500}>25%</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Total Staked:</Text>
          <Text size="xs" weight={500}>{innerProps.project.totalStaked / TOKEN_EXP} {TOKEN_NAME}</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Your staked position:</Text>
          <Text size="xs" weight={500}>{stateTempValues?.[0]?.toNumber() / TOKEN_EXP} {TOKEN_NAME}</Text>
        </Group>
      </Paper>


      <Group mt="xl" spacing="xs">
        <NumberInput
          hideControls
          sx={{ flex: 1 }}
          description={stakeAmountString}
          placeholder={TOKEN_NAME}
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

      <Text mt="sm" size="xs">Available Balance: {contract.accountBalance/TOKEN_EXP} {TOKEN_NAME}</Text>

      <Checkbox
        mt="xl"
        size="xs"
        label={(
          <Text size="xs">
            I agree to the <Anchor size="xs">User Agreenment</Anchor> and <Anchor size="xs">Privacy Policy</Anchor>
          </Text>
        )}
        
      />
      
      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button onClick={handleStakeTokensToProject} variant="light">Stake</Button>
      </Group>
    </>
  );
}