import { useState } from "react";
import { Button, Group, Loader, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { showSuccessNotification, showInfoNotification, showErrorNotification } from "../../utils/notifications";
import { addProject } from "../../services/contract";
import useProjects from "../../hooks/useProjects";

export default function OwnerNewProjectModal({ context, id }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [priceKg, setPriceKg] = useState(0);
  const [verifiedKg, setVerifiedKg] = useState(0);
  const [isTransacting, setIsTransacting] = useState(false);
  const { createProject, deleteProject } = useProjects();

  async function handleAddProject() {
    setIsTransacting(true);
    createProject.mutate({
      name,
      image,
      price_kg: priceKg,
      verified_kg: verifiedKg,
      collateral_risk: 0,
      staked_tokens: 0
    }, {
      onSuccess: async (project) => {
        const res = await addProject(project.id, project.verified_kg)
        setIsTransacting(false);
        
        if (res) {
          showSuccessNotification(`${project.name} has been created`);
          context.closeModal(id);
        } else {
          showErrorNotification("Error creating project in contract");
          deleteProject.mutate(project.id, {
            onSuccess: () => showInfoNotification("Reverted new project in api"),
            onError: () => showErrorNotification("Error reverting project in api")
          });
        }
      },
      onError: () => {
        setIsTransacting(false);
        showErrorNotification("Error creating project in api");
      }
    });
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
