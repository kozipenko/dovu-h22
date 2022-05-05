import { useEffect, useState } from "react";
import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { AlertTriangle, SquareCheck } from "tabler-icons-react";
import { claimDemoTokensForStaking, getTotalTokensClaimed, TOKEN_EXP, TOKEN_NAME, useContract } from "../../store/contract";

export default function ClaimTokensModal({ context, id, innerProps }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [totalTokensClaimed, setTotalTokensClaimed] = useState(null);
  const contract = useContract();

  async function loadTotalTokensClaimed() {
    const total = await getTotalTokensClaimed();
    setTotalTokensClaimed(total);
  }

  useEffect(() => {
    claimDemoTokensForStaking(contract.maxClaimableTokens).then(setResponse).catch(setError)
  }, [contract.maxClaimableTokens]);

  useEffect(() => {
    loadTotalTokensClaimed().catch(error => showNotification({
      title: "An error has occured loading total claimed tokens",
      message: error.message
    }));
  }, [response]);

  return response ? (
    <>
      <Group spacing="xs">
        <SquareCheck color="#4c6ef5" size={18} />
        <Text size="sm">
          You have successfully claimed {contract.maxClaimableTokens / TOKEN_EXP} tokens.
        </Text>
      </Group>
  
      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Total Tokens Claimed:</Text>
          <Text size="xs" weight={500}>{totalTokensClaimed} {TOKEN_NAME}</Text>
        </Group>
      </Paper>

      <Button fullWidth mt="xl" variant="light" onClick={() => context.closeModal(id)}>
        Continue
      </Button>
    </>
  ) : (
    <>
      <Group spacing="xs">
        <SquareCheck color="#4c6ef5" size={18} />
        <Text size="sm">
         {contract.maxClaimableTokens / TOKEN_EXP} tokens have been sent to {innerProps.pairedAccount}.
        </Text>
      </Group>

      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Total Tokens Claimed:</Text>
          <Text size="xs" weight={500}>{totalTokensClaimed} {TOKEN_NAME}</Text>
        </Group>
      </Paper>
      {error ? (
        <>
          <Group position="apart" mt="xl">
            <Group spacing="xs">
              <AlertTriangle color="#f03e3e" size={18} />
              <Text size="sm" color="red">{error.message}</Text>
            </Group>
            <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
              Cancel
            </Button>
          </Group>
        </>
      ) : (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}