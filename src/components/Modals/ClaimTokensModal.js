import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { showErrorNotification, showSuccessNotification } from "../../utils/notifications";
import { TOKEN_ID, TOKEN_NAME } from "../../utils/constants";
import { useApi } from "../../services/api";
import { useContract } from "../../services/contract";
import { InfoSquare } from "tabler-icons-react";

export default function ClaimTokensModal({ context, id }) {
  const api = useApi();
  const contract = useContract();

  async function handleClaimDemoTokensForStaking() {
    try {
      const amount = api.maxClaimableTokens.data - api.claimedTokens.data;
      const res = await contract.claimDemoTokens.mutateAsync(amount);

      if (res.success) {
        if (api.claimedTokens.data >= 0) {
          await api.updateTokenClaim.mutateAsync(api.claimedTokens.data + amount);
        } else {
          await api.createTokenClaim.mutateAsync(amount);
        }
        showSuccessNotification("Success", `${amount.toLocaleString()} ${TOKEN_NAME} have been sent to your account`);
      }
      else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      showErrorNotification("Error", error.message);
    }
  }

  return (
    <>
      <Group spacing="xs">
        <InfoSquare color="#4c6ef5" size={18} />
        <Text size="sm">
          Please associate token <b>{TOKEN_ID}</b> before continuing
        </Text>
      </Group>

      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Total Tokens Claimed:</Text>
          <Text size="xs" weight={500}>{api.claimedTokens.data.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Max Claimable Tokens:</Text>
          <Text size="xs" weight={500}>{api.maxClaimableTokens.data.toLocaleString()} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={contract.claimDemoTokens.isLoading || api.claimedTokens.data >= api.maxClaimableTokens.data}
          onClick={handleClaimDemoTokensForStaking}
        >
          Claim
        </Button>
      </Group>

      {contract.claimDemoTokens.isLoading && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}