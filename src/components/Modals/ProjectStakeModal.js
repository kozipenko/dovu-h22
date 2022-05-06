import { useEffect, useState } from "react";
import { Anchor, Button, Checkbox, Group, NumberInput, Paper, Select, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import {
  getStakedPosition,
  TOKEN_NAME,
  unstakeTokensFromProject,
  getNumberOfTokensStakedToProject,
  getAccountBalance,
  getCollateralRisk
} from "../../store/contract";

// TODO: Needs a lot of work...
export default function ProjectStakeModal({ context, id, innerProps }) {
  const [accountBalance, setAccountBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [term, setTerm] = useState("1");
  const [position, setPosition] = useState({});
  const [totalStakedToProject, setTotalStakedToProject] = useState(0);
  const [collateralRisk, setCollateralRisk] = useState(0); // TODO: Make this live.
  const [releaseDate, setReleaseDate] = useState("N/A");
  const modals = useModals();

  const intNoFmt = new Intl.NumberFormat("en-GB");
  
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

  async function handleUnstakeTokensFromProject() {
    const response = await unstakeTokensFromProject(innerProps.project.id, amount); 
    console.log(response);
  }

  async function loadGetCollateral() {
    const response = await getCollateralRisk(innerProps.project.id);
    setCollateralRisk(response); 
  }

  async function loadAccountBalance() {
    const balance = await getAccountBalance();
    setAccountBalance(balance);
  }

  async function loadStakedPosition() {
    const pos = await getStakedPosition(innerProps.project.id);
    toUtcTimeString(pos.unlockTime); // TODO: setPosition is not working as intended .. fix & i thought i staked for 10 years not 1 prob need to check this.
    setPosition(pos);
  }

  async function loadTotalStakedToProject() {
    const total = await getNumberOfTokensStakedToProject(innerProps.project.id);
    setTotalStakedToProject(total);
  }

  async function toUtcTimeString(time) {
    const rDate  = new Date(time * 1000)
    setReleaseDate(rDate.toUTCString());
  }

  useEffect(() => {
    loadAccountBalance();
    loadTotalStakedToProject();
    loadStakedPosition();
    loadGetCollateral();
  }, []);
  
  //
  // TODO: Disable button with unmarked checkbox.
  // TODO: check if wallet paired then display staking details.
  return (position.open) ? (
    <>
      <Paper withBorder mt="xs" p="xs">

        <Group position="apart">
          <Text size="xs" color="dimmed">APY:</Text>
          <Text size="xs" weight={500}>25%</Text>
        </Group>

        <Group position="apart">
          <Text size="xs" color="dimmed">Collateral Risk:</Text>
          <Text size="xs" weight={500}>{collateralRisk}</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Total Staked:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(totalStakedToProject)} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart">
          <Text size="xs" color="dimmed">Position Status:</Text>
          <Text size="xs" color="green" weight={500}>{(position.open) ? "Open":"Closed"}</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Postion Value:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(position.amount)} {TOKEN_NAME}</Text>
        </Group>

        <Group mt="xs" position="apart">
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
      <Paper withBorder mt="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">APY:</Text>
          <Text size="xs" weight={500}>25%</Text>
        </Group>

        <Group position="apart">
          <Text size="xs" color="dimmed">Collateral Risk:</Text>
          <Text size="xs" weight={500}>{collateralRisk}</Text>
        </Group>
        
        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Total Staked:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(totalStakedToProject)} {TOKEN_NAME}</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Your Balance:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(accountBalance)} {TOKEN_NAME}</Text>
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