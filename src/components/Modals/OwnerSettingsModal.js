import { useEffect, useState } from "react";
import { Text, Paper, Group, NumberInput, Button, Stack, Loader } from "@mantine/core";
import { addTokensToTreasury, getMaximumClaimableTokens, getTreasuryBalance, updateClaimableTokens, TOKEN_NAME } from "../../services/contract";

export default function OwnerSettingsModal() {
  const [isTransacting, setIsTransacting] = useState(false);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [maxClaimableTokens, setMaxClaimableTokens] = useState(0);
  const [newMaxClaimableTokens, setNewMaxClaimableTokens] = useState(0);
  const [xferToTreasury, setXferToTreasury] = useState(0);

  async function handleAddTokenstoTreasury() {
    setIsTransacting(true);
    const response = await addTokensToTreasury(xferToTreasury);
    if (response.success) {
      setTreasuryBalance(treasuryBalance + xferToTreasury)
      setXferToTreasury(0);
    }
    setIsTransacting(false);
  }

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
    getTreasuryBalance().then(setTreasuryBalance);
    getMaximumClaimableTokens().then(setMaxClaimableTokens);
  }, [isTransacting]);

  return (
    <>
      <Paper withBorder my="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Treasury Balance:</Text>
          <Text size="xs" weight={500}>{treasuryBalance.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>
        <Group position="apart">
          <Text size="xs" color="dimmed">Current Claimable Max:</Text>
          <Text size="xs" weight={500}>{maxClaimableTokens.toLocaleString()} {TOKEN_NAME}</Text>
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