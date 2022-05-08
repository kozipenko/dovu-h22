import { useEffect, useState } from "react";
import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { claimDemoTokensForStaking, getMaximumClaimableTokens, getTotalTokensClaimed, TOKEN_NAME } from "../../services/contract";

export default function ClaimTokensModal({ context, id }) {
  const [isTransacting, setIsTransacting] = useState(false);
  const [maximumClaimableTokens, setMaximumClaimableTokens] = useState(0);
  const [totalTokensClaimed, setTotalTokensClaimed] = useState(0);

  async function handleClaimDemoTokensForStaking() {
    setIsTransacting(true);
    await claimDemoTokensForStaking(maximumClaimableTokens-totalTokensClaimed).catch(() => setIsTransacting(false));
    setIsTransacting(false);
  }

  useEffect(() => {
    getTotalTokensClaimed().then(setTotalTokensClaimed);
    getMaximumClaimableTokens().then(setMaximumClaimableTokens);
  }, []);

  return (
    <>
      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Total Tokens Claimed:</Text>
          <Text size="xs" weight={500}>{totalTokensClaimed} {TOKEN_NAME}</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Max Claimable Tokens:</Text>
          <Text size="xs" weight={500}>{maximumClaimableTokens} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={isTransacting || !maximumClaimableTokens}
          onClick={handleClaimDemoTokensForStaking}
        >
          Claim
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