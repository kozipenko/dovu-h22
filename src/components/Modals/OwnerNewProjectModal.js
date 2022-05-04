import { useState } from "react";
import { Button, Group, Loader, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { addProject } from "../../store/contract";
import { createProject } from "../../store/projects";
import { AlertTriangle, SquareCheck } from "tabler-icons-react";

export default function OwnerNewProjectsModal({ context, id }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(null);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [verifiedKg, setVerifiedKg] = useState(null);
  const [priceKg, setPriceKg] = useState(null);

  async function handleAddProject() {
    try {
      setIsLoading(true);
      const response = await addProject(projectId, verifiedKg);
      
      if (response) {
        createProject(projectId, projectName, projectImage, verifiedKg, priceKg);
        setIsLoading(false);
        setIsCreated(true);
      } else {
        setError("Error creating project");
      }
    } catch (error) {
      console.log(error);
      setError("Error creating project");
      setIsLoading(false);
    }
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
            {projectName} has been successfully created.
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
        placeholder="x.x.xxxxxxx"
        value={projectId}
        label={<Text size="xs" color="dimmed">ID</Text>}
        onChange={(e) => setProjectId(e.currentTarget.value)}
      />

      <TextInput
        mt="xs"
        placeholder="Schrute Farms"
        value={projectName}
        label={<Text size="xs" color="dimmed">Name</Text>}
        onChange={(e) => setProjectName(e.currentTarget.value)}
      />

      <TextInput
        mt="xs"
        placeholder="https://freepik.com/"
        value={projectImage}
        label={<Text size="xs" color="dimmed">Image</Text>}
        onChange={(e) => setProjectImage(e.currentTarget.value)}
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
          disabled={!projectId || !projectName || isLoading}
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
