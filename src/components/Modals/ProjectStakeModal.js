import { useEffect, useState } from "react";
import { Anchor, Button, Checkbox, Group, NumberInput, Paper, Select, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import {
  getStakedPosition,
  TOKEN_NAME,
  unstakeTokensFromProject,
  getNumberOfTokensStakedToProject,
  getAccountBalance
} from "../../store/contract";

// TODO: Needs a lot of work...
export default function ProjectStakeModal({ context, id, innerProps }) {
  const [accountBalance, setAccountBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [term, setTerm] = useState("1");
  const [position, setPosition] = useState({});
  const [totalStakedToProject, setTotalStakedToProject] = useState(0);
  const modals = useModals();

  async function handleOpenProjectStakeConfirmModal() {
    modals.openContextModal("projectStakeConfirm", {
      title: "Confirm Staking Position",
      innerProps: {
        term,
        amount,
        projectId: innerProps.project.id,
      }
    });
  }

  async function handleUnstakeTokensFromProject() {
    const response = await unstakeTokensFromProject(innerProps.project.id, amount); 
    console.log(response);
  }

  async function loadAccountBalance() {
    const balance = await getAccountBalance();
    setAccountBalance(balance);
  }

  async function loadStakedPosition() {
    const pos = await getStakedPosition(innerProps.project.id);
    setPosition(pos);
  }

  async function loadTotalStakedToProject() {
    const total = await getNumberOfTokensStakedToProject(innerProps.project.id);
    setTotalStakedToProject(total);
  }

  useEffect(() => {
    loadAccountBalance();
    loadTotalStakedToProject();
    loadStakedPosition();
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
          <Text size="xs" weight={500}>{totalStakedToProject} {TOKEN_NAME}</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">My Staked Position:</Text>
          <Text size="xs" weight={500}>{position.amount} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Group mt="xl" spacing="xs">
        <NumberInput
          hideControls
          sx={{ flex: 1 }}
          description={`Amount (${TOKEN_NAME}):`}
          placeholder={TOKEN_NAME}
          value={amount}
          onChange={setAmount}
        />
        <Select
          description="Term (Years):"
          zIndex={1000}
          value={term}
          sx={{ maxWidth: 76 }}
          data={["1","2","3","4","5","6","7","8","9","10"]}
          onChange={setTerm}
        />
      </Group>

      <Text mt="sm" size="xs">Available Balance: {accountBalance} {TOKEN_NAME}</Text>

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
        <Button
          variant="light"
          disabled={!amount}
          onClick={handleOpenProjectStakeConfirmModal}
        >
          Stake
        </Button>
      </Group>
    </>
  );
}