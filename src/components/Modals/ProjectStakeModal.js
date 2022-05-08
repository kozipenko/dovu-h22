import { useEffect, useState } from "react";
import { Anchor, Button, Checkbox, Group, NumberInput, Paper, Select, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { getAccountBalance } from "../../services/wallet";
import { getCollateralRisk, getNumberOfTokensStakedToProject, getStakedPosition, TOKEN_NAME } from "../../services/contract";

export default function ProjectStakeModal({ context, id, innerProps }) {
  const [accountBalance, setAccountBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [term, setTerm] = useState("1");
  const [position, setPosition] = useState({});
  const [totalStakedToProject, setTotalStakedToProject] = useState(0);
  const [collateralRisk, setCollateralRisk] = useState(0); // TODO: Make this live.
  const [releaseDate, setReleaseDate] = useState("N/A");
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
  
  async function handleOpenProjectUnstakeConfirmModal() {
    modals.openContextModal("projectUnstakeConfirm", {
      title: "Confirm Position Closure",
      innerProps: {
        projectId: innerProps.project.id,
      }
    });
  }

  // Is this needed still?
  async function toUtcTimeString(time) {
    const rDate  = new Date(time * 1000)
    setReleaseDate(rDate.toUTCString());
  }

  useEffect(() => {
    getAccountBalance().then(setAccountBalance);
    getStakedPosition(innerProps.project.id).then(setPosition); //  toUtcTimeString(pos.unlockTime) needed still?
    getCollateralRisk(innerProps.project.id).then(setCollateralRisk);
    getNumberOfTokensStakedToProject(innerProps.project.id).then(setTotalStakedToProject);
  }, []);
  
  //
  // TODO: Disable button with unmarked checkbox.
  // TODO: check if wallet paired then display staking details.
  return (position.open) ? (
    <>
      <Paper withBorder mt="xl" p="xs">

        <Group position="apart">
          <Text size="xs" color="dimmed">APY:</Text>
          <Text size="xs" weight={500}>25%</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Collateral Risk:</Text>
          <Text size="xs" weight={500}>{collateralRisk}</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Total Staked:</Text>
          <Text size="xs" weight={500}>{totalStakedToProject.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Position Status:</Text>
          <Text size="xs" color="green" weight={500}>{(position.open) ? "Open":"Closed"}</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Postion Value:</Text>
          <Text size="xs" weight={500}>{position.amount.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Release Date: </Text>
          <Text size="xs" weight={500}>{releaseDate}</Text>
        </Group>

        <Group position="right" spacing="xs" mt="xl">
          <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
            Cancel
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={handleOpenProjectUnstakeConfirmModal}
          >
            Unstake
          </Button>
        </Group>
      </Paper>
    </>
  ) : (
    <>
      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">APY:</Text>
          <Text size="xs" weight={500}>25%</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Collateral Risk:</Text>
          <Text size="xs" weight={500}>{collateralRisk}</Text>
        </Group>
        
        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Total Staked:</Text>
          <Text size="xs" weight={500}>{totalStakedToProject.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Your Balance:</Text>
          <Text size="xs" weight={500}>{accountBalance.toLocaleString()} {TOKEN_NAME}</Text>
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