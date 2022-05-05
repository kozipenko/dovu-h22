import { Button, Group, Loader, NumberInput, Select, Stack, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useModals } from "@mantine/modals";
import { addVerifiedCarbon, getVerifiedCarbonForProject, removeVerifiedCarbon } from "../../store/contract";
import { updateProject, useProjects } from "../../store/projects";

export default function OwnerEditProjectsModal({ context, id }) {
  const [isTransacting, setIsTransacting] = useState(false);
  const [isVerifiedKgLoading, setIsVerifiedKgLoading] = useState(false);
  const [verifiedKg, setVerifiedKg] = useState(null);
  const [originalVerifiedKg, setOriginalVerifiedKg] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const modals = useModals();
  const projects = useProjects();
  const projectsList = projects.list.map(p => ({ label: p.name, value: p.id }));

  function handleOpenOwnerNewProjectModal() {
    modals.openContextModal("ownerNewProject", {
      title: "Create New Project"
    });
  }

  function handleProjectChange(id) {
    setSelectedProject(projects.list.find(p => p.id === id));
    setVerifiedKg(null);
    setOriginalVerifiedKg(null);
  }

  function handleProjectNameChange(event) {
    setSelectedProject({ ...selectedProject, name: event.currentTarget.value });
  }

  function handleProjectImageChange(event) {
    setSelectedProject({ ...selectedProject, image: event.currentTarget.value });
  }

  function handleProjectPriceKgChange(priceKg) {
    setSelectedProject({ ...selectedProject, priceKg });
  }

  function handleVerifiedKgChange(verifiedKg) {
    setVerifiedKg(verifiedKg);
  }

  async function loadVerifiedKg() {
    setIsVerifiedKgLoading(true);
    const verifiedKg = await getVerifiedCarbonForProject(selectedProject.id);
    setVerifiedKg(verifiedKg);
    setOriginalVerifiedKg(verifiedKg);
    setIsVerifiedKgLoading(false);
  }

  async function handleSaveProject() {
    setIsTransacting(true);
    
    if (verifiedKg > originalVerifiedKg) {
      const newVerifiedKg = verifiedKg - originalVerifiedKg;
      const response = await addVerifiedCarbon(selectedProject.id, newVerifiedKg);
      loadVerifiedKg();
    } else if (verifiedKg < originalVerifiedKg) {
      const newVerifiedKg = originalVerifiedKg - verifiedKg;
      const response = await removeVerifiedCarbon(selectedProject.id, newVerifiedKg);
      loadVerifiedKg();
    }

    updateProject(selectedProject);
    setIsTransacting(false);
  }

  useEffect(() => {
    if (selectedProject && !verifiedKg)
      loadVerifiedKg();
  }, [selectedProject]);

  return (
    <>
      <Group align="end">
        <Select
          searchable
          placeholder="Select Project"
          label={<Text size="xs" color="dimmed">Project</Text>}
          zIndex={1000}
          value={selectedProject?.id}
          data={projectsList}
          onChange={handleProjectChange}
          sx={{flex: 1}}
        />
        <Button variant="light" color="green" onClick={handleOpenOwnerNewProjectModal}>
          New
        </Button>
      </Group>

      {selectedProject && (
        <>
          <TextInput
            readOnly
            mt="md"
            placeholder="x.x.xxxxxxx"
            value={selectedProject.id}
            label={<Text size="xs" color="dimmed">ID</Text>}
          />

          <TextInput
            mt="xs"
            placeholder="Schrute Farms"
            value={selectedProject.name}
            label={<Text size="xs" color="dimmed">Name</Text>}
            onChange={handleProjectNameChange}
          />

          <TextInput
            mt="xs"
            placeholder="https://freepik.com/"
            value={selectedProject.image}
            label={<Text size="xs" color="dimmed">Image</Text>}
            onChange={handleProjectImageChange}
          />

          <NumberInput
            mt="xs"
            min={0}
            disabled={isVerifiedKgLoading}
            rightSection={isVerifiedKgLoading && <Loader size="xs" />}
            value={verifiedKg}
            label={<Text size="xs" color="dimmed">Verified Carbon (kg)</Text>}
            onChange={handleVerifiedKgChange}
          />

          <NumberInput
            mt="xs"
            min={0}
            value={selectedProject.priceKg}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) => `$ ${value}`}
            label={<Text size="xs" color="dimmed">Carbon Price (USD)</Text>}
            onChange={handleProjectPriceKgChange}
          />
        </>
      )}

      <Group position="right" spacing="xs" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button
          variant="light"
          disabled={isTransacting || isVerifiedKgLoading}
          onClick={handleSaveProject}
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
