import { Button, Group, Loader, NumberInput, Select, Text } from "@mantine/core";
import { useState } from "react";
import { useModals } from "@mantine/modals";
import { addProject, addVerifiedCarbon, getVerifiedCarbonForProject, removeVerifiedCarbon } from "../../store/contract";
import projectsData from "../../data/projects";

export default function OwnerProjectsModal({ context, id }) {
  const [project, setProject] = useState(null);
  const [verifiedCarbon, setVerifiedCarbon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const modals = useModals();
  const projects = projectsData.map(p => ({ label: p.name, value: p.id }));

  function handleChangeProject(id) {
    setProject(projects.find(p => p.value === id));
    setIsLoading(true);
    getVerifiedCarbonForProject(id.toString()).then(result => {
      setVerifiedCarbon(result);
      setIsLoading(false);
    });
  }

  function handleOpenOwnerNewProjectModal() {
    modals.openContextModal("ownerNewProject", {
      title: "Create New Project"
    });
  }

  function handleSaveProject() {
    
  }

  // TODO: implement
  async function handleAddProject(accountId, verifiedCarbonKg) {
    const response = await addProject(accountId, verifiedCarbonKg);
    console.log(response);
  }

  // TODO: implement
  async function handleAddVerifiedCarbon() {
    return;
  }

  // TODO: implement
  async function handleRemoveVerifiedCarbon() {
    return;
  }

  return (
    <>
      <Group align="end">
        <Select
          searchable
          placeholder="Select Project"
          label={<Text size="xs" color="dimmed">Project</Text>}
          zIndex={1000}
          value={project?.value}
          data={projects}
          onChange={handleChangeProject}
          sx={{flex: 1}}
        />
        <Button color="green" onClick={handleOpenOwnerNewProjectModal}>
          New
        </Button>
      </Group>

      {project && (
        <NumberInput
          mt="md"
          disabled={isLoading}
          placeholder={isLoading && "Loading..."}
          rightSection={isLoading && <Loader size="xs" />}
          label={<Text size="xs" color="dimmed">Verified Carbon (kg)</Text>}
          value={verifiedCarbon}
        />
      )}

      <Group position="right" mt="xl">
        <Button variant="light" color="red" onClick={() => context.closeModal(id)}>
          Cancel
        </Button>
        <Button variant="light">Save</Button>
      </Group>
    </>
  );
}
