import { useEffect, useState } from "react";
import { Anchor, Button, Checkbox, Group, Loader, NumberInput, Paper, Select, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showErrorNotification, showSuccessNotification } from "../../utils/notifications";
import { TOKEN_NAME } from "../../utils/constants";
import { useApi } from "../../services/api";
import { useWallet } from "../../services/wallet";
import { useContract } from "../../services/contract";

export default function ProjectStakeModal({ context, id, innerProps }) {
  const [agrees, setAgrees] = useState(false);
  const [timeLocked, setTimeLocked] = useState(true);
  const [term, setTerm] = useState(0);
  const [amount, setAmount] = useState(0);
  const api = useApi();
  const wallet = useWallet();
  const contract = useContract();
  const modals = useModals();

  const totalStakedTokens = api.positions.data
    .filter(pos => pos.project_id === innerProps.project.id && !pos.is_closed)
    .reduce((acc, obj) => acc + obj.dov_staked, 0);

  const totalSurrenderedTokens = api.positions.data
    .filter(pos => pos.project_id === innerProps.project.id && !pos.is_closed)
    .reduce((acc, obj) => acc + obj.surrendered_dov, 0);

  const position = api.positions.data.slice().reverse()
    .find(pos => pos.hedera_account === wallet.local.accountId && pos.project_id === innerProps.project.id);
    
  async function handleRemoveTimeLockForProject() {
    try {
      const res = await contract.removeTimelockForProject.mutateAsync(innerProps.project.id);
      
      if (res.success) {
        await api.updatePosition.mutateAsync({
          id: position.id,
          is_closed: 0,
          dov_staked: position.dov_staked,
          surrendered_dov: position.surrendered_dov,
          hedera_account: position.hedera_account,
          number_days: 0,
          stake_ends_at: new Date().toUTCString()
        });
        showSuccessNotification("Success", `Removed timelock`);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      showErrorNotification("Error", error.message);
    }
  }

  async function handleOpenProjectStakeConfirmModal() {
    modals.openContextModal("projectStakeConfirm", {
      title: "Confirm Staking Position",
      innerProps: {
        term,
        amount,
        accountId: wallet.local.accountId,
        project: innerProps.project,
        closeModal: () => context.closeModal(id)
      }
    });
  }
  
  async function handleOpenProjectUnstakeConfirmModal() {
    modals.openContextModal("projectUnstakeConfirm", {
      title: "Confirm Position Closure",
      innerProps: {
        position,
        is_locked: timeLocked,
        project: innerProps.project,
        closeModal: () => context.closeModal(id),
      }
    });
  }
  useEffect(() => {
    console.log(position)
    if (position.number_days === 0) {
      setTimeLocked(false);
    }
  },
  [position])
  function renderStaking() {
    return (
      <>
        <Paper withBorder mt="xl" p="xs">
          <Group position="apart">
            <Text size="xs" color="dimmed">APY:</Text>
            <Text size="xs" weight={500}>25 %</Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Total Staked:</Text>
            <Text size="xs" weight={500}>
              {totalStakedTokens.toLocaleString()} {TOKEN_NAME}
            </Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Total Surrendered:</Text>
            <Text size="xs" weight={500}>
              {totalSurrenderedTokens.toLocaleString()} {TOKEN_NAME}
            </Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Collateral Risk:</Text>
            <Text size="xs" weight={500}>{innerProps.project.collateral_risk} %</Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Account Balance:</Text>
            <Text size="xs" weight={500}>{wallet.accountBalance.data.toLocaleString()} {TOKEN_NAME}</Text>
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
            defaultValue={1}
            sx={{ maxWidth: 76 }}
            onChange={setTerm}
            data={[
              { value: 1, label: "1"},
              { value: 2, label: "2"},
              { value: 3, label: "3"},
              { value: 4, label: "4"},
              { value: 5, label: "5"},
              { value: 6, label: "6"},
              { value: 7, label: "7"},
              { value: 8, label: "8"},
              { value: 9, label: "9"},
              { value: 10, label: "10"},
            ]}
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
            disabled={!amount || !term || !agrees || !wallet.accountBalance.data}
            onClick={handleOpenProjectStakeConfirmModal}
          >
            Stake
          </Button>
        </Group>
      </>
    );
  }

  function renderUnstaking() {
    return (
      <>
        <Paper withBorder mt="xl" p="xs">
          <Group position="apart">
            <Text size="xs" color="dimmed">APY:</Text>
            <Text size="xs" weight={500}>25 %</Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Collateral Risk:</Text>
            <Text size="xs" weight={500}>{innerProps.project.collateral_risk} %</Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Total Staked:</Text>
            <Text size="xs" weight={500}>
              {totalStakedTokens.toLocaleString()} {TOKEN_NAME}
            </Text>
          </Group>
          
          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Total Surrendered:</Text>
            <Text size="xs" weight={500}>
              {totalSurrenderedTokens.toLocaleString()} {TOKEN_NAME}
            </Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Position Value:</Text>
            <Text size="xs" weight={500}>
              {position.dov_staked.toLocaleString()} {TOKEN_NAME}
            </Text>
          </Group>

          <Group position="apart" mt="xs">
            <Text size="xs" color="dimmed">Release Date: </Text>
            <Text size="xs" weight={500}>{position.stake_ends_at}</Text>
          </Group>
        </Paper>

        <Group position="apart" mt="xl">
          <Button variant="outline" onClick={handleRemoveTimeLockForProject}>
            Remove Timelock
          </Button>
          <Group spacing="xs">
            <Button variant="light" onClick={() => context.closeModal(id)}>
              Cancel
            </Button>
            {timeLocked && (<Button
              variant="light"
              color="red"
              onClick={handleOpenProjectUnstakeConfirmModal}
              >
              Unstake
              </Button>)
            }

            {!timeLocked && (<Button
              variant="light"
              color="green"
              onClick={handleOpenProjectUnstakeConfirmModal}
              >
              Claim
              </Button>)
            }
        
          </Group>
        </Group>

        {contract.removeTimelockForProject.isLoading && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
      </>
    );
  }

  return position ?
    !position.is_closed ? renderUnstaking() : renderStaking() : renderStaking();
}