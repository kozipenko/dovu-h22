import { useEffect, useState } from "react";
import { Text, Paper, Group, NumberInput, Button, Stack, Loader } from "@mantine/core";
import {
  TOKEN_NAME,
  addTokensToTreasury,
  updateClaimableTokens,
  getTreasuryBalance,
  getMaxClaimableTokens
} from "../../store/contract";

export default function OwnerSettingsModal() {
  const [isTransacting, setIsTransacting] = useState(false);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [maxClaimableTokens, setMaxClaimableTokens] = useState(0);
  const [newMaxClaimableTokens, setNewMaxClaimableTokens] = useState(0);
  const [xferToTreasury, setXferToTreasury] = useState(0);

  const intNoFmt = new Intl.NumberFormat("en-GB");

  async function loadTreasuryBalance() {
    const balance = await getTreasuryBalance();
    setTreasuryBalance(balance);
  }

  async function loadMaxClaimableTokens() {
    const max = await getMaxClaimableTokens();
    setMaxClaimableTokens(max);
  }

  async function handleAddTokenstoTreasury() {
    setIsTransacting(true);
    const response = await addTokensToTreasury(xferToTreasury);
    if (response.success) {
      setTreasuryBalance(xferToTreasury)
      setXferToTreasury(0);
    }
    setIsTransacting(false);
  }

  // TODO: implement
  async function handleUpdateClaimableTokens() {
    setIsTransacting(true);
    const response = await updateClaimableTokens(newMaxClaimableTokens);
    if (response) {
      setMaxClaimableTokens(newMaxClaimableTokens);
      setNewMaxClaimableTokens(0);
    }
    setIsTransacting(false);
  }

  useEffect(() => {
    loadTreasuryBalance();
    loadMaxClaimableTokens();
  }, []);

  return (
    <>
      <Paper withBorder my="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Treasury Balance:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(treasuryBalance || 0)} {TOKEN_NAME}</Text>
        </Group>
        <Group position="apart">
          <Text size="xs" color="dimmed">Current Claimable Max:</Text>
          <Text size="xs" weight={500}>{intNoFmt.format(maxClaimableTokens)} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Group mt="xl" spacing="xs">
        <NumberInput
          hideControls
          sx={{ flex: 1 }}
          description={`Add Tokens to Treasury (${TOKEN_NAME})`}
          placeholder={TOKEN_NAME}
          value={xferToTreasury}
          onChange={value => setXferToTreasury(value)}
        />
        <Button
          mt="md"
          variant="light"
          color="green"
          zindex={1000}
          sx={{ maxWidth: 125 }}
          onClick={handleAddTokenstoTreasury}
          >Deposit</Button>
      </Group>
      <Group mt="xl" spacing="xs">
        <NumberInput
          hideControls
          sx={{ flex: 1 }}
          description={`Set Max Claimable Tokens (${TOKEN_NAME}):`}
          placeholder={TOKEN_NAME}
          value={newMaxClaimableTokens}
          onChange={setNewMaxClaimableTokens}
        />
        <Button
          mt="md"
          variant="light"
          color="green"
          zindex={1000}
          sx={{ maxWidth: 125 }}
          onClick={handleUpdateClaimableTokens}
        >
          Update
        </Button>
      </Group>

      {isTransacting && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}