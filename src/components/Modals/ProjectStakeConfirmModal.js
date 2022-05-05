import { useState } from "react";
import { Button, Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { stakeTokensToProject, TOKEN_NAME } from "../../store/contract";

export default function ProjectStakeConfirmModal({ context, id, innerProps }) {
  const [isTransacting, setIsTransacting] = useState(false);

  async function handleStakeTokensToProject() {
    setIsTransacting(true);
    const response = await stakeTokensToProject(innerProps.projectId, innerProps.amount);
    setIsTransacting(false);
    
    if (response)
      context.closeModal(id);
  }

  return (
    <>
      <Paper withBorder mt="xs" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">APY:</Text>
          <Text size="xs" weight={500}>25%</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Staking Amount:</Text>
          <Text size="xs" weight={500}>{innerProps.amount} {TOKEN_NAME}</Text>
        </Group>

        <Group mt="xs" position="apart">
          <Text size="xs" color="dimmed">Term Length:</Text>
          <Text size="xs" weight={500}>{innerProps.term} year(s)</Text>
        </Group>
      </Paper>

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          onClick={handleStakeTokensToProject}
        >
          Confirm
        </Button>
      </Group>

      {isTransacting && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  )
}