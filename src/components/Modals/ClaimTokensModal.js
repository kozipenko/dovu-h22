import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { AlertTriangle, SquareCheck } from "tabler-icons-react";
import { claimDemoTokensForStaking, loadTotalTokensClaimed, useContract } from "../../store/contract";

// TODO: This value does not work
const TOKEN_AMOUNT = 5*10**8

export default function ClaimTokensModal({ context, id, innerProps }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const contract = useContract();

  useEffect(() => {
    claimDemoTokensForStaking(100000).then(setResponse).catch(setError)
  }, []);

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
          You have successfully claimed 10 tokens.
        </Text>
      </Group>

      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Total Tokens Claimed:</Text>
          <Text size="xs" weight={500}>{contract.totalTokensClaimed} lol</Text>
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
          10 tokens have been sent to {innerProps.pairedAccount}.
        </Text>
      </Group>

      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Total Tokens Claimed:</Text>
          <Text size="xs" weight={500}>{contract.totalTokensClaimed} lol</Text>
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
          <Text size="xs" color="dimmed">Transacting</Text>
        </Stack>
      )}
    </>
  );
}