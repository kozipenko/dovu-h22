import { Button, Group, NumberInput, Text, TextInput } from "@mantine/core";

export default function OwnerNewProjectsModal({ context, id }) {
 
  return (
    <>
      <TextInput
        placeholder="Project Name"
        label={<Text size="xs" color="dimmed">Name</Text>}
      />

      <NumberInput
        mt="md"
        value={0}
        label={<Text size="xs" color="dimmed">Verified Carbon (kg)</Text>}
      />

      <Group position="right" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button disabled variant="light">
          Save
        </Button>
      </Group>
    </>
  );
}
