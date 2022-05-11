import { useState } from "react";
import { Text, Paper, Group, NumberInput, Button, Stack, Loader } from "@mantine/core";
import { showErrorNotification, showSuccessNotification } from "../../utils/notifications";
import { TOKEN_NAME } from "../../utils/constants";
import useApi from "../../hooks/api";
import useContract from "../../hooks/contract";

export default function OwnerSettingsModal({ context, id }) {
  const [newMaxClaimableTokens, setNewMaxClaimableTokens] = useState(0);
  const [xferToTreasury, setXferToTreasury] = useState(0);
  const { getTreasuryBalance, getMaxClaimableTokens, updateMaxClaimableTokens } = useApi();
  const { addTokensToTreasury, updateClaimableTokens } = useContract();
  
  async function handleAddTokenstoTreasury() {
    try {
      const res = await addTokensToTreasury.mutateAsync(xferToTreasury);

      if (res.success) {
        showSuccessNotification("Success", `${xferToTreasury.toLocaleString()} tokens transferred to treasury`);
      }
      else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      showErrorNotification("Error", error.message);
    } finally {
      setXferToTreasury(0);
    }
  }

  async function handleUpdateClaimableTokens() {
    try {
      const res = await updateClaimableTokens.mutateAsync(newMaxClaimableTokens);

      if (res.success) {
        await updateMaxClaimableTokens.mutateAsync(newMaxClaimableTokens);
        showSuccessNotification("Success", `Max claimable tokens set to ${newMaxClaimableTokens.toLocaleString()}`);
      }
      else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      showErrorNotification("Error", error.message);
    } finally {
      setNewMaxClaimableTokens(0);
    }
  }

  return (
    <>
      <Paper withBorder my="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Treasury Balance:</Text>
          <Text size="xs" weight={500}>{getTreasuryBalance.data.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>
        <Group position="apart">
          <Text size="xs" color="dimmed">Current Claimable Max:</Text>
          <Text size="xs" weight={500}>{getMaxClaimableTokens.data.toLocaleString()} {TOKEN_NAME}</Text>
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

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
      </Group>

      {(addTokensToTreasury.isLoading || updateClaimableTokens.isLoading) && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}