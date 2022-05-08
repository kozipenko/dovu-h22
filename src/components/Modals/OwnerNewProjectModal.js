import { useState } from "react";
import { Button, Group, Loader, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { AlertTriangle, SquareCheck } from "tabler-icons-react";

export default function OwnerNewProjectModal({ context, id }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(null);
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [verifiedKg, setVerifiedKg] = useState(null);
  const [priceKg, setPriceKg] = useState(null);


  async function handleAddProject() {
   //
  }
 
  return (isCreated || error) ? (
    <>
      {error ? (
        <Group spacing="xs">
          <AlertTriangle color="#f03e3e" size={18} />
          <Text size="sm">
            {error}
          </Text>
        </Group>
      ) : (
        <Group spacing="xs">
          <SquareCheck color="#4c6ef5" size={18} />
          <Text size="sm">
            {name} has been successfully created.
          </Text>
        </Group>
      )}

      <Button fullWidth mt="xl" variant="light" onClick={() => context.closeModal(id)}>
        Continue
      </Button>
    </>
  ) : (
    <>
      <TextInput
        mt="xs"
        placeholder="Schrute Farms"
        value={name}
        label={<Text size="xs" color="dimmed">Name</Text>}
        onChange={(e) => setName(e.currentTarget.value)}
      />

      <TextInput
        mt="xs"
        placeholder="URL"
        value={image}
        label={<Text size="xs" color="dimmed">Image</Text>}
        onChange={(e) => setImage(e.currentTarget.value)}
      />

      <NumberInput
        mt="xs"
        placeholder="0"
        min={0}
        value={verifiedKg}
        label={<Text size="xs" color="dimmed">Verified Carbon (kg)</Text>}
        onChange={setVerifiedKg}
      />

      <NumberInput
        mt="xs"
        placeholder="0"
        min={0}
        value={priceKg}
        label={<Text size="xs" color="dimmed">Carbon Price (USD)</Text>}
        onChange={setPriceKg}
      />

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={!projectId || !name || isLoading}
          onClick={handleAddProject}
        >
          Save
        </Button>
      </Group>

      {isLoading && (
        <Stack align="center" spacing="xs" mt="xl">
          <Loader size="sm" variant="dots" />
          <Text size="xs" color="dimmed">Tansacting</Text>
        </Stack>
      )}
    </>
  );
}
