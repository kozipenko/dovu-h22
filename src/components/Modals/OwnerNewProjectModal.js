import { useState } from "react";
import { Button, Group, Loader, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { addProject } from "../../services/contract";
import { createProject } from "../../services/api";

export default function OwnerNewProjectModal({ context, id }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [priceKg, setPriceKg] = useState(0);
  const [verifiedKg, setVerifiedKg] = useState(0);
  const [isTransacting, setIsTransacting] = useState(false);


  async function handleAddProject() {
    setIsTransacting(true);
    const project = await createProject({
      name,
      image,
      price_kg: priceKg,
      verified_kg: verifiedKg,
      collateral_risk: 0,
      staked_tokens: 0
    });

    if (project.id)
      await addProject(project.id, project.verified_kg);

    setIsTransacting(false);
    context.closeModal(id);
  }
 
  return (
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
        value={priceKg}
        label={<Text size="xs" color="dimmed">Carbon Price (USD)</Text>}
        onChange={setPriceKg}
      />

      <NumberInput
        mt="xs"
        placeholder="0"
        min={0}
        value={verifiedKg}
        label={<Text size="xs" color="dimmed">Verified Carbon (kg)</Text>}
        onChange={setVerifiedKg}
      />

      <TextInput
        disabled
        mt="xs"
        value={0}
        label={<Text size="xs" color="dimmed">Collateral Risk</Text>}
      />

      <TextInput
        disabled
        mt="xs"
        value={0}
        label={<Text size="xs" color="dimmed">Staked Tokens</Text>}
      />

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={!name || isTransacting}
          onClick={handleAddProject}
        >
          Save
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
