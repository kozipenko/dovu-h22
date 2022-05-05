import { useEffect, useState } from "react";
import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import {
  claimDemoTokensForStaking,
  getMaxClaimableTokens,
  getTotalTokensClaimed,
  TOKEN_NAME
} from "../../store/contract";

export default function ClaimTokensModal({ context, id }) {
  const [isTransacting, setIsTransacting] = useState(false);
  const [maxClaimableTokens, setMaxClaimableTokens] = useState(0);
  const [totalTokensClaimed, setTotalTokensClaimed] = useState(0);

  async function loadMaxClaimableTokens() {
    const max = await getMaxClaimableTokens();
    setMaxClaimableTokens(max);
  }

  async function loadTotalTokensClaimed() {
    const total = await getTotalTokensClaimed();
    setTotalTokensClaimed(total);
  }

  async function handleClaimDemoTokensForStaking() {
    setIsTransacting(true);
    await claimDemoTokensForStaking(maxClaimableTokens).catch(() => setIsTransacting(false));
    setIsTransacting(false);
  }

  useEffect(() => {
    loadMaxClaimableTokens();
    loadTotalTokensClaimed();
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
          <Text size="xs" weight={500}>{maxClaimableTokens} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={isTransacting || !maxClaimableTokens}
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