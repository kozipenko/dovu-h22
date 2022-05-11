import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { showErrorNotification, showSuccessNotification } from "../../utils/notifications";
import { TOKEN_NAME } from "../../utils/constants";
import useApi from "../../hooks/api";
import useContract from "../../hooks/contract";

export default function ClaimTokensModal({ context, id }) {
  const { createClaimedToken, getClaimedTokens, getMaxClaimableTokens } = useApi();
  const { claimDemoTokens } = useContract();

  async function handleClaimDemoTokensForStaking() {
    try {
      const amount = getMaxClaimableTokens.data - getClaimedTokens.data
      const res = await claimDemoTokens.mutateAsync(amount);

      if (res.success) {
        await createClaimedToken.mutateAsync(amount);
        showSuccessNotification("Success", `${amount} tokens have been sent to your account`);
      }
      else {
        throw Error("Transaction failed");
      }
    } catch (error) {
      showErrorNotification("Error", error.message);
    }
  }

  return (
    <>
      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Total Tokens Claimed:</Text>
          <Text size="xs" weight={500}>{getClaimedTokens.data.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Max Claimable Tokens:</Text>
          <Text size="xs" weight={500}>{getMaxClaimableTokens.data.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={claimDemoTokens.isLoading}
          onClick={handleClaimDemoTokensForStaking}
        >
          Claim
        </Button>
      </Group>

      {claimDemoTokens.isLoading && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}