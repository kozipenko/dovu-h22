import { useEffect, useState } from "react";
import { Anchor, Button, Checkbox, Group, NumberInput, Paper, Select, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { getAccountBalance, useWallet } from "../../services/wallet";
import { removeTimelockForProject, TOKEN_NAME } from "../../services/contract";
import { getStakedPosition, getTotalStakedTokens } from "../../services/api";

export default function ProjectStakeModal({ context, id, innerProps }) {
  const [agrees, setAgrees] = useState(false);
  const [term, setTerm] = useState("1");
  const [amount, setAmount] = useState(0);
  const [stakedPosition, setStakedPosition] = useState(null);
  const [totalStakedTokens, setTotalStakedTokens] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const { accountId } = useWallet();
  const modals = useModals();

  function getReleaseDate() {
    const currDate = Math.floor((new Date()).getTime() / 1000);
    const termFromNow = currDate + (31536000 * term);
    const utcTermStringFromNow = new Date(termFromNow * 1000);
    return utcTermStringFromNow.toUTCString();
  }

  async function handleRemoveTimeLockForProject() {
    const res = await removeTimelockForProject(innerProps.project.id);
    
    if (res) {
      console.log("Removed timelock.");
    }

  }

  async function handleOpenProjectStakeConfirmModal() {
    modals.openContextModal("projectStakeConfirm", {
      title: "Confirm Staking Position",
      innerProps: {
        term,
        amount,
        accountId,
        project: innerProps.project,
        cModal,
      }
    });
  }
  
  async function handleOpenProjectUnstakeConfirmModal() {
    modals.openContextModal("projectUnstakeConfirm", {
      title: "Confirm Position Closure",
      innerProps: {
        stakedPosition,
        project: innerProps.project,
        cModal,
      }
    });
  }

  // Is this needed still? Oui, pour la date de détachement.
  async function toUtcTimeString(time) {
    const rDate  = new Date(time * 1000)
    //setReleaseDate(rDate.toUTCString());
  }

  function cModal() {
    context.closeModal(id); 
  }
  console.log(stakedPosition)

  useEffect(() => {
    getAccountBalance().then(setAccountBalance);
    getTotalStakedTokens(innerProps.project.id).then(setTotalStakedTokens);
    getStakedPosition(accountId, innerProps.project.id).then(setStakedPosition);
  }, []);

  function renderStaking() {
    return (
      <>
        <Paper withBorder mt="xl" p="xs">
          <Group position="apart">
            <Text size="xs" color="dimmed">APY:</Text>
            <Text size="xs" weight={500}>25%</Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Total Staked:</Text>
            <Text size="xs" weight={500}>
              {totalStakedTokens.toLocaleString()} {TOKEN_NAME}
            </Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Collateral Risk:</Text>
            <Text size="xs" weight={500}>{innerProps.project.collateral_risk}</Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Account Balance:</Text>
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
          value={agrees}
          onChange={event => setAgrees(event.currentTarget.checked)}
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
            disabled={!amount || !agrees || !accountBalance}
            onClick={handleOpenProjectStakeConfirmModal}
          >
            Stake
          </Button>
        </Group>
      </>
    );
  }
  // TODO: Make collateral risk live
  function renderUnstaking() {
    return (
      <>
        <Paper withBorder mt="xl" p="xs">
          <Group position="apart">
            <Text size="xs" color="dimmed">APY:</Text>
            <Text size="xs" weight={500}>25%</Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Collateral Risk:</Text>
            <Text size="xs" weight={500}>{innerProps.project.collateral_risk}</Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Total Staked:</Text>
            <Text size="xs" weight={500}>
              {totalStakedTokens.toLocaleString()} {TOKEN_NAME}
            </Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Postion Value:</Text>
            <Text size="xs" weight={500}>
              {stakedPosition.dov_staked.toLocaleString()} {TOKEN_NAME}
            </Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Release Date: </Text>
            <Text size="xs" weight={500}>require project.unlock_time</Text>
          </Group>
        </Paper>

        <Group position="right" spacing="xs" mt="xl">
          <Button onClick={handleRemoveTimeLockForProject}>
            Remove Timelock
          </Button>
          <Button variant="light" onClick={() => context.closeModal(id)}>
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
      </>
    );
  }

  return stakedPosition ?
    !stakedPosition.is_closed ? renderUnstaking() : renderStaking() : renderStaking();
}