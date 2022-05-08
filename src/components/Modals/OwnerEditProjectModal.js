import { useState } from "react";
import { Button, Group, NumberInput, Text, TextInput } from "@mantine/core";

export default function OwnerEditProjectsModal({ innerProps, context, id }) {
  const [newName, setNewName] = useState(innerProps.project.name);
  const [newImage, setNewImage] = useState(innerProps.project.image);
  const [newVerifiedKg, setNewVerifiedKg] = useState(innerProps.project.verified_kg);
  const [newPriceKg, setNewPriceKg] = useState(innerProps.project.price_kg);

  async function handleEditProject() {
    
  }

  return (
    <>
      <TextInput
        readOnly
        mt="md"
        value={innerProps.project.id}
        label={<Text size="xs" color="dimmed">ID</Text>}
      />

      <TextInput
        mt="xs"
        value={newName}
        label={<Text size="xs" color="dimmed">Name</Text>}
        onChange={(e) => setNewName(e.currentTarget.value)}
      />

      <TextInput
        mt="xs"
        value={newImage}
        label={<Text size="xs" color="dimmed">Image</Text>}
        onChange={(e) => setNewImage(e.currentTarget.value)}
      />

      <NumberInput
        mt="xs"
        min={0}
        disabled={null}//{isVerifiedKgLoading}
        rightSection={null}//{isVerifiedKgLoading && <Loader size="xs" />}
        value={newVerifiedKg}
        label={<Text size="xs" color="dimmed">Verified Carbon (kg)</Text>}
        onChange={setNewVerifiedKg}
      />

      <NumberInput
        mt="xs"
        min={0}
        value={newPriceKg}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        formatter={(value) => `$ ${value}`}
        label={<Text size="xs" color="dimmed">Carbon Price (USD)</Text>}
        onChange={setNewPriceKg}
      />

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={null} //{isTransacting || isVerifiedKgLoading}
          onClick={handleEditProject}
        >
          Save
        </Button>
      </Group>

    </>
  );
}
