import { Button, Group, Paper, Text, TextInput } from "@mantine/core";
import { Leaf } from "tabler-icons-react";

export default function ProjectPurchaseModal({ context, id, innerProps }) {
  // TOOD
  async function handleProjectOffsetPurchase() {
    return;
  }

  return (
    <>
      <Paper withBorder mt="xl" p="xs">
        <Group position="apart">
          <Text size="xs" color="dimmed">Total Offsets Remaining:</Text>
          <Text size="xs" weight={500}>{innerProps.project.verified_kg.toLocaleString()} kg</Text>
        </Group>

        <Group position="apart" mt="xs">
          <Text size="xs" color="dimmed">Total Offsets Purchased:</Text>
          <Text size="xs" weight={500}>2,000 kg</Text>
        </Group>
      </Paper>

      <TextInput
        mt="xl"
        description="Amount (kg)"
        rightSectionWidth={110}
        icon={<Leaf size={18} />}
        value={0}
      />

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button variant="light" onClick={handleProjectOffsetPurchase}>
          Purchase
        </Button>
      </Group>
    </>
  );
}